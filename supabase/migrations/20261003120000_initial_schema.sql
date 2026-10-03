-- =====================================================================
-- Paletto — schéma initial
-- Place de marché de palettes entre particuliers
-- =====================================================================

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

-- ---------------------------------------------------------------------
-- Fonctions utilitaires
-- ---------------------------------------------------------------------
create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------
-- Profils
-- ---------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 40),
  city text check (city is null or char_length(city) <= 80),
  bio text check (bio is null or char_length(bio) <= 500),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Les profils sont publics"
  on public.profiles for select
  using (true);

create policy "Chacun modifie son profil"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (display_name, city, bio) on public.profiles to authenticated;

-- Création automatique du profil à l'inscription
create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text;
begin
  v_name := left(
    coalesce(
      nullif(trim(new.raw_user_meta_data ->> 'display_name'), ''),
      split_part(coalesce(new.email, ''), '@', 1)
    ),
    40
  );
  if char_length(coalesce(v_name, '')) < 2 then
    v_name := 'Membre';
  end if;

  insert into public.profiles (id, display_name) values (new.id, v_name);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function private.handle_new_user();

-- ---------------------------------------------------------------------
-- Annonces
-- ---------------------------------------------------------------------
create table public.listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references public.profiles (id) on delete cascade,
  title text not null check (char_length(title) between 5 and 100),
  description text not null check (char_length(description) between 10 and 4000),
  pallet_type text not null
    check (pallet_type in ('europe', 'standard', 'demi', 'perdue', 'plastique', 'autre')),
  condition text not null
    check (condition in ('neuve', 'tres_bon_etat', 'bon_etat', 'usagee', 'a_reparer')),
  quantity integer not null check (quantity between 1 and 100000),
  price_cents integer not null check (price_cents between 0 and 10000000),
  price_negotiable boolean not null default false,
  delivery_possible boolean not null default false,
  postal_code text not null check (postal_code ~ '^[0-9]{5}$'),
  city text not null check (char_length(city) between 1 and 80),
  department text generated always as (
    case when postal_code like '97%' then left(postal_code, 3) else left(postal_code, 2) end
  ) stored,
  images text[] not null default '{}' check (cardinality(images) <= 8),
  status text not null default 'active' check (status in ('active', 'reserved', 'sold')),
  views integer not null default 0,
  search tsvector generated always as (
    setweight(to_tsvector('french'::regconfig, coalesce(title, '')), 'A') ||
    setweight(to_tsvector('french'::regconfig, coalesce(city, '')), 'B') ||
    setweight(to_tsvector('french'::regconfig, coalesce(description, '')), 'C')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index listings_status_created_idx on public.listings (status, created_at desc);
create index listings_seller_idx on public.listings (seller_id);
create index listings_department_idx on public.listings (department);
create index listings_type_idx on public.listings (pallet_type);
create index listings_search_idx on public.listings using gin (search);

create trigger listings_set_updated_at
  before update on public.listings
  for each row execute function private.set_updated_at();

alter table public.listings enable row level security;

create policy "Les annonces sont publiques"
  on public.listings for select
  using (true);

create policy "Créer ses annonces"
  on public.listings for insert
  to authenticated
  with check ((select auth.uid()) = seller_id);

create policy "Modifier ses annonces"
  on public.listings for update
  to authenticated
  using ((select auth.uid()) = seller_id)
  with check ((select auth.uid()) = seller_id);

create policy "Supprimer ses annonces"
  on public.listings for delete
  to authenticated
  using ((select auth.uid()) = seller_id);

revoke insert, update on public.listings from anon, authenticated;
revoke delete on public.listings from anon;
grant insert (
  seller_id, title, description, pallet_type, condition, quantity, price_cents,
  price_negotiable, delivery_possible, postal_code, city, images, status
) on public.listings to authenticated;
grant update (
  title, description, pallet_type, condition, quantity, price_cents,
  price_negotiable, delivery_possible, postal_code, city, images, status
) on public.listings to authenticated;

-- Compteur de vues
create or replace function public.increment_listing_views(p_listing_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.listings set views = views + 1 where id = p_listing_id;
$$;

revoke execute on function public.increment_listing_views(uuid) from public;
grant execute on function public.increment_listing_views(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------
-- Favoris
-- ---------------------------------------------------------------------
create table public.favorites (
  user_id uuid not null references public.profiles (id) on delete cascade,
  listing_id uuid not null references public.listings (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, listing_id)
);

create index favorites_listing_idx on public.favorites (listing_id);

alter table public.favorites enable row level security;

create policy "Voir ses favoris"
  on public.favorites for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Ajouter un favori"
  on public.favorites for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Retirer un favori"
  on public.favorites for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on public.favorites from anon;
revoke update on public.favorites from authenticated;

-- ---------------------------------------------------------------------
-- Messagerie
-- ---------------------------------------------------------------------
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid references public.listings (id) on delete set null,
  buyer_id uuid not null references public.profiles (id) on delete cascade,
  seller_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  last_message_at timestamptz not null default now(),
  unique (listing_id, buyer_id),
  check (buyer_id <> seller_id)
);

create index conversations_buyer_idx on public.conversations (buyer_id, last_message_at desc);
create index conversations_seller_idx on public.conversations (seller_id, last_message_at desc);

alter table public.conversations enable row level security;

create policy "Voir ses conversations"
  on public.conversations for select
  to authenticated
  using ((select auth.uid()) in (buyer_id, seller_id));

revoke all on public.conversations from anon;
revoke insert, update, delete on public.conversations from authenticated;

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id uuid not null references public.profiles (id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 2000),
  created_at timestamptz not null default now(),
  read_at timestamptz
);

create index messages_conversation_idx on public.messages (conversation_id, created_at);
create index messages_unread_idx on public.messages (conversation_id) where read_at is null;
create index messages_sender_idx on public.messages (sender_id);

create or replace function private.is_conversation_participant(p_conversation_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.conversations c
    where c.id = p_conversation_id
      and (select auth.uid()) in (c.buyer_id, c.seller_id)
  );
$$;

grant usage on schema private to authenticated;
revoke execute on function private.is_conversation_participant(uuid) from public;
grant execute on function private.is_conversation_participant(uuid) to authenticated;

alter table public.messages enable row level security;

create policy "Lire les messages de ses conversations"
  on public.messages for select
  to authenticated
  using (private.is_conversation_participant(conversation_id));

create policy "Écrire dans ses conversations"
  on public.messages for insert
  to authenticated
  with check (
    (select auth.uid()) = sender_id
    and private.is_conversation_participant(conversation_id)
  );

revoke all on public.messages from anon;
revoke insert, update, delete on public.messages from authenticated;
grant insert (conversation_id, sender_id, body) on public.messages to authenticated;

create or replace function private.touch_conversation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.conversations
    set last_message_at = new.created_at
    where id = new.conversation_id;
  return new;
end;
$$;

create trigger messages_touch_conversation
  after insert on public.messages
  for each row execute function private.touch_conversation();

-- Démarrer (ou reprendre) une conversation depuis une annonce
create or replace function public.start_conversation(p_listing_id uuid, p_body text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_seller uuid;
  v_status text;
  v_conversation uuid;
begin
  if v_uid is null then
    raise exception 'Vous devez être connecté pour envoyer un message.';
  end if;

  select seller_id, status into v_seller, v_status
  from public.listings
  where id = p_listing_id;

  if v_seller is null then
    raise exception 'Annonce introuvable.';
  end if;
  if v_seller = v_uid then
    raise exception 'Vous ne pouvez pas répondre à votre propre annonce.';
  end if;
  if v_status = 'sold' then
    raise exception 'Cette annonce est déjà vendue.';
  end if;
  if p_body is null or char_length(btrim(p_body)) = 0 or char_length(p_body) > 2000 then
    raise exception 'Le message doit contenir entre 1 et 2000 caractères.';
  end if;

  insert into public.conversations (listing_id, buyer_id, seller_id)
  values (p_listing_id, v_uid, v_seller)
  on conflict (listing_id, buyer_id) do update set last_message_at = now()
  returning id into v_conversation;

  insert into public.messages (conversation_id, sender_id, body)
  values (v_conversation, v_uid, btrim(p_body));

  return v_conversation;
end;
$$;

revoke execute on function public.start_conversation(uuid, text) from public, anon;
grant execute on function public.start_conversation(uuid, text) to authenticated;

-- Marquer une conversation comme lue
create or replace function public.mark_conversation_read(p_conversation_id uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.messages m
    set read_at = now()
    where m.conversation_id = p_conversation_id
      and m.sender_id <> (select auth.uid())
      and m.read_at is null
      and exists (
        select 1 from public.conversations c
        where c.id = p_conversation_id
          and (select auth.uid()) in (c.buyer_id, c.seller_id)
      );
$$;

revoke execute on function public.mark_conversation_read(uuid) from public, anon;
grant execute on function public.mark_conversation_read(uuid) to authenticated;

-- Liste des conversations de l'utilisateur connecté
create or replace function public.my_conversations()
returns table (
  id uuid,
  listing_id uuid,
  listing_title text,
  listing_image text,
  listing_status text,
  other_user_id uuid,
  other_user_name text,
  is_seller boolean,
  last_message text,
  last_sender_id uuid,
  last_message_at timestamptz,
  unread_count bigint
)
language sql
stable
security invoker
set search_path = ''
as $$
  select
    c.id,
    c.listing_id,
    l.title,
    l.images[1],
    l.status,
    p.id,
    p.display_name,
    c.seller_id = (select auth.uid()),
    lm.body,
    lm.sender_id,
    c.last_message_at,
    (
      select count(*)
      from public.messages m2
      where m2.conversation_id = c.id
        and m2.sender_id <> (select auth.uid())
        and m2.read_at is null
    )
  from public.conversations c
  left join public.listings l on l.id = c.listing_id
  join public.profiles p
    on p.id = case when c.buyer_id = (select auth.uid()) then c.seller_id else c.buyer_id end
  left join lateral (
    select m.body, m.sender_id
    from public.messages m
    where m.conversation_id = c.id
    order by m.created_at desc
    limit 1
  ) lm on true
  where (select auth.uid()) in (c.buyer_id, c.seller_id)
  order by c.last_message_at desc;
$$;

revoke execute on function public.my_conversations() from public, anon;
grant execute on function public.my_conversations() to authenticated;

-- Temps réel sur les messages
alter publication supabase_realtime add table public.messages;

-- ---------------------------------------------------------------------
-- Signalements
-- ---------------------------------------------------------------------
create table public.reports (
  id uuid primary key default gen_random_uuid(),
  listing_id uuid not null references public.listings (id) on delete cascade,
  reporter_id uuid references public.profiles (id) on delete set null,
  reason text not null
    check (reason in ('arnaque', 'contenu_inapproprie', 'deja_vendu', 'doublon', 'autre')),
  details text check (details is null or char_length(details) <= 1000),
  created_at timestamptz not null default now(),
  unique (listing_id, reporter_id)
);

create index reports_listing_idx on public.reports (listing_id);
create index reports_reporter_idx on public.reports (reporter_id);

alter table public.reports enable row level security;

create policy "Signaler une annonce"
  on public.reports for insert
  to authenticated
  with check ((select auth.uid()) = reporter_id);

revoke all on public.reports from anon;
revoke select, update, delete on public.reports from authenticated;

-- ---------------------------------------------------------------------
-- Stockage des photos
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'listing-images',
  'listing-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

create policy "Envoyer des photos dans son dossier"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Voir ses propres fichiers"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "Supprimer ses photos"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'listing-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
