import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { after } from "next/server";
import {
  CalendarDays,
  ChevronRight,
  Eye,
  LogIn,
  MapPin,
  MessageCircle,
  Package,
  Pencil,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { ContactForm } from "@/components/contact-form";
import { FavoriteButton } from "@/components/favorite-button";
import { ImageGallery } from "@/components/image-gallery";
import { ListingGrid } from "@/components/listing-card";
import { ReportDialog } from "@/components/report-dialog";
import { ShareButton } from "@/components/share-button";
import { Alert, Badge, Card, buttonClasses } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { CONDITIONS, PALLET_TYPES, type Condition, type PalletType } from "@/lib/constants";
import { getFavoriteIds, getListing, getSimilarListings } from "@/lib/data/listings";
import { findConversationForListing } from "@/lib/data/messages";
import { departmentName } from "@/lib/departments";
import { formatDate, formatMemberSince, formatPrice, formatTotalPrice, pluralize } from "@/lib/format";
import { listingImageUrl } from "@/lib/images";
import { absoluteUrl } from "@/lib/site";
import { createAnonClient } from "@/lib/supabase/anon";

export async function generateMetadata({ params }: PageProps<"/annonces/[id]">): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) return { title: "Annonce introuvable" };

  const price = listing.price_cents === 0 ? "gratuites" : `${formatPrice(listing.price_cents)} / palette`;
  const description = `${listing.quantity} × ${PALLET_TYPES[listing.pallet_type as PalletType]?.short ?? "palette"} — ${price} — ${listing.city} (${listing.postal_code}). ${listing.description.slice(0, 120)}`;
  const image = listingImageUrl(listing.images[0]);

  return {
    title: `${listing.title} – ${listing.city}`,
    description,
    alternates: { canonical: `/annonces/${listing.id}` },
    openGraph: {
      type: "website",
      title: listing.title,
      description,
      url: `/annonces/${listing.id}`,
      images: image ? [{ url: image, alt: listing.title }] : undefined,
    },
    robots: listing.status === "sold" ? { index: false } : undefined,
  };
}

export default async function ListingPage({ params, searchParams }: PageProps<"/annonces/[id]">) {
  const { id } = await params;
  const query = await searchParams;
  const listing = await getListing(id);
  if (!listing) notFound();

  after(async () => {
    await createAnonClient().rpc("increment_listing_views", { p_listing_id: listing.id });
  });

  const user = await getCurrentUser();
  const isOwner = user?.id === listing.seller_id;
  const [favoriteIds, similar, existingConversation] = await Promise.all([
    getFavoriteIds(user?.id),
    getSimilarListings(listing),
    user && !isOwner ? findConversationForListing(listing.id, user.id) : Promise.resolve(null),
  ]);

  const type = PALLET_TYPES[listing.pallet_type as PalletType];
  const condition = CONDITIONS[listing.condition as Condition];
  const seller = Array.isArray(listing.seller) ? listing.seller[0] : listing.seller;
  const images = listing.images.map((path) => listingImageUrl(path)).filter((url): url is string => Boolean(url));
  const dept = departmentName(listing.department);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: listing.title,
    description: listing.description,
    image: images.length > 0 ? images : undefined,
    category: type?.label,
    offers: {
      "@type": "Offer",
      price: (listing.price_cents / 100).toFixed(2),
      priceCurrency: "EUR",
      availability:
        listing.status === "sold" ? "https://schema.org/SoldOut" : "https://schema.org/InStock",
      itemCondition:
        listing.condition === "neuve" ? "https://schema.org/NewCondition" : "https://schema.org/UsedCondition",
      url: absoluteUrl(`/annonces/${listing.id}`),
      areaServed: listing.city,
    },
  };

  return (
    <div className="container-page py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Fil d'Ariane" className="mb-6 flex flex-wrap items-center gap-1 text-sm text-stone-500">
        <Link href="/annonces" className="hover:text-brand-700">
          Annonces
        </Link>
        <ChevronRight className="size-4" aria-hidden />
        <Link href={`/annonces?type=${listing.pallet_type}`} className="hover:text-brand-700">
          {type?.short ?? "Palettes"}
        </Link>
        {listing.department ? (
          <>
            <ChevronRight className="size-4" aria-hidden />
            <Link href={`/annonces?type=${listing.pallet_type}&dept=${listing.department}`} className="hover:text-brand-700">
              {dept ?? listing.department}
            </Link>
          </>
        ) : null}
      </nav>

      {query.publiee === "1" ? (
        <Alert tone="success" className="mb-6">
          <strong>Votre annonce est en ligne !</strong> Partagez-la pour la faire connaître. Vous serez prévenu dans
          votre messagerie dès qu&apos;un acheteur vous écrira.
        </Alert>
      ) : null}
      {query.modifiee === "1" ? (
        <Alert tone="success" className="mb-6">
          Vos modifications ont bien été enregistrées.
        </Alert>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div className="min-w-0">
          <ImageGallery images={images} title={listing.title} palletType={listing.pallet_type} />

          <section className="mt-8">
            <h2 className="text-xl font-bold">Description</h2>
            <p className="mt-3 whitespace-pre-line leading-relaxed text-stone-700">{listing.description}</p>
          </section>

          <section className="mt-8">
            <h2 className="text-xl font-bold">Caractéristiques</h2>
            <dl className="mt-4 grid gap-px overflow-hidden rounded-2xl border border-stone-200 bg-stone-200 sm:grid-cols-2">
              <Spec label="Type de palette" value={type?.label ?? "—"} />
              <Spec label="Dimensions" value={type?.dimensions ?? "—"} />
              <Spec label="État" value={condition?.label ?? "—"} />
              <Spec label="Quantité disponible" value={pluralize(listing.quantity, "palette")} />
              <Spec
                label="Prix unitaire"
                value={`${formatPrice(listing.price_cents)}${listing.price_negotiable ? " (à débattre)" : ""}`}
              />
              <Spec label="Livraison" value={listing.delivery_possible ? "Possible (à convenir)" : "À retirer sur place"} />
            </dl>
          </section>

          <section id="securite" className="mt-8 rounded-2xl border border-forest-200 bg-forest-50 p-5">
            <h2 className="flex items-center gap-2 font-sans text-base font-bold text-forest-900">
              <ShieldCheck className="size-5" aria-hidden />
              Achetez en toute sérénité
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-forest-900/90">
              <li>• Privilégiez la remise en main propre et vérifiez les palettes avant de payer.</li>
              <li>• Ne versez jamais d&apos;acompte par mandat cash, coupon ou virement à un inconnu.</li>
              <li>• Restez sur la messagerie Paletto tant que vous n&apos;avez pas rencontré le vendeur.</li>
            </ul>
          </section>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-stone-500">
            <span className="inline-flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4" aria-hidden /> Publiée le {formatDate(listing.created_at)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Eye className="size-4" aria-hidden /> {pluralize(listing.views, "vue")}
              </span>
            </span>
            {!isOwner ? <ReportDialog listingId={listing.id} isLoggedIn={Boolean(user)} /> : null}
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          <Card className="p-6">
            <div className="flex flex-wrap gap-1.5">
              {listing.status === "reserved" ? <Badge tone="amber">Réservée</Badge> : null}
              {listing.status === "sold" ? <Badge tone="red">Vendue</Badge> : null}
              <Badge tone="brand">{type?.short ?? "Palette"}</Badge>
              <Badge tone={condition?.tone === "green" ? "green" : "stone"}>{condition?.label}</Badge>
            </div>
            <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight">{listing.title}</h1>

            <div className="mt-4 flex items-end gap-2">
              <p className="font-display text-4xl font-extrabold text-stone-900">{formatPrice(listing.price_cents)}</p>
              {listing.price_cents > 0 ? <p className="pb-1.5 text-stone-500">/ palette</p> : null}
            </div>
            {listing.price_cents > 0 && listing.quantity > 1 ? (
              <p className="mt-1 text-sm text-stone-600">
                Soit {formatTotalPrice(listing.price_cents, listing.quantity)} pour le lot de {listing.quantity}
              </p>
            ) : null}
            {listing.price_negotiable ? <p className="mt-1 text-sm font-semibold text-forest-700">Prix à débattre</p> : null}

            <ul className="mt-5 space-y-2.5 text-[15px] text-stone-700">
              <li className="flex items-center gap-2.5">
                <Package className="size-5 text-stone-400" aria-hidden />
                {pluralize(listing.quantity, "palette disponible", "palettes disponibles")}
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin className="size-5 text-stone-400" aria-hidden />
                {listing.city} ({listing.postal_code})
              </li>
              <li className="flex items-center gap-2.5">
                <Truck className="size-5 text-stone-400" aria-hidden />
                {listing.delivery_possible ? "Livraison possible" : "À retirer sur place"}
              </li>
            </ul>

            <div className="mt-6 border-t border-stone-100 pt-6">
              {isOwner ? (
                <div className="space-y-3">
                  <Alert tone="info">C&apos;est votre annonce. Gérez son statut depuis votre espace.</Alert>
                  <Link href={`/annonces/${listing.id}/modifier`} className={buttonClasses({ className: "w-full" })}>
                    <Pencil className="size-4" aria-hidden />
                    Modifier l&apos;annonce
                  </Link>
                  <Link href="/compte" className={buttonClasses({ variant: "outline", className: "w-full" })}>
                    Gérer mes annonces
                  </Link>
                </div>
              ) : listing.status === "sold" ? (
                <Alert tone="info">Cette annonce est vendue. Découvrez des annonces similaires ci-dessous.</Alert>
              ) : !user ? (
                <div className="space-y-3">
                  <p className="text-sm text-stone-600">Connectez-vous pour contacter le vendeur via la messagerie Paletto.</p>
                  <Link
                    href={`/connexion?next=${encodeURIComponent(`/annonces/${listing.id}`)}`}
                    className={buttonClasses({ className: "w-full" })}
                  >
                    <LogIn className="size-4" aria-hidden />
                    Se connecter pour contacter
                  </Link>
                  <Link
                    href={`/inscription?next=${encodeURIComponent(`/annonces/${listing.id}`)}`}
                    className={buttonClasses({ variant: "outline", className: "w-full" })}
                  >
                    Créer un compte gratuit
                  </Link>
                </div>
              ) : existingConversation ? (
                <div className="space-y-3">
                  <p className="text-sm text-stone-600">Vous avez déjà contacté ce vendeur.</p>
                  <Link href={`/messages/${existingConversation}`} className={buttonClasses({ className: "w-full" })}>
                    <MessageCircle className="size-4" aria-hidden />
                    Voir la conversation
                  </Link>
                </div>
              ) : (
                <ContactForm listingId={listing.id} listingTitle={listing.title} />
              )}
            </div>

            {!isOwner ? (
              <div className="mt-4 flex gap-2">
                <div className="flex-1 [&>button]:w-full">
                  <FavoriteButton listingId={listing.id} initialFavorited={favoriteIds.has(listing.id)} variant="full" />
                </div>
                <ShareButton title={listing.title} />
              </div>
            ) : (
              <div className="mt-4 [&>button]:w-full">
                <ShareButton title={listing.title} />
              </div>
            )}
          </Card>

          {seller ? (
            <Card className="p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-stone-500">Vendeur</p>
              <Link href={`/vendeurs/${seller.id}`} className="group mt-3 flex items-center gap-3">
                <span className="flex size-12 items-center justify-center rounded-full bg-forest-700 text-lg font-bold text-white">
                  {seller.display_name.charAt(0).toUpperCase()}
                </span>
                <span>
                  <span className="block font-semibold text-stone-900 group-hover:text-brand-700">{seller.display_name}</span>
                  <span className="block text-sm text-stone-500">
                    Membre depuis {formatMemberSince(seller.created_at)}
                    {seller.city ? ` · ${seller.city}` : ""}
                  </span>
                </span>
              </Link>
              <Link
                href={`/vendeurs/${seller.id}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
              >
                <UserRound className="size-4" aria-hidden />
                Voir ses autres annonces
              </Link>
            </Card>
          ) : null}
        </aside>
      </div>

      {similar.length > 0 ? (
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight">Annonces similaires</h2>
          <div className="mt-6">
            <ListingGrid listings={similar} favoriteIds={favoriteIds} />
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-4 py-3">
      <dt className="text-sm text-stone-500">{label}</dt>
      <dd className="mt-0.5 font-semibold text-stone-900">{value}</dd>
    </div>
  );
}
