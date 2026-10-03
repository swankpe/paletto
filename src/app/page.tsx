import Link from "next/link";
import {
  ArrowRight,
  BadgeEuro,
  Camera,
  Handshake,
  Leaf,
  MapPin,
  MessageCircle,
  Recycle,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ListingGrid } from "@/components/listing-card";
import { PalletIllustration } from "@/components/pallet-illustration";
import { Alert, buttonClasses } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { PALLET_TYPES, PALLET_TYPE_KEYS } from "@/lib/constants";
import { DEPARTMENTS } from "@/lib/departments";
import { getFavoriteIds, getLatestListings, getMarketplaceStats } from "@/lib/data/listings";
import { pluralize } from "@/lib/format";
import { siteConfig } from "@/lib/site";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const user = await getCurrentUser();
  const [latest, stats, favoriteIds] = await Promise.all([
    getLatestListings(8),
    getMarketplaceStats(),
    getFavoriteIds(user?.id),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/annonces?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {params.compte === "supprime" ? (
        <div className="container-page pt-6">
          <Alert tone="success">Votre compte et toutes vos données ont été supprimés. À bientôt peut-être !</Alert>
        </div>
      ) : null}

      {/* Hero */}
      <section className="wood-texture relative overflow-hidden border-b border-stone-200/70">
        <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-[1.15fr_1fr] lg:py-24">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3 py-1 text-sm font-semibold text-brand-800">
              <Sparkles className="size-4" aria-hidden />
              100 % gratuit, sans commission
            </p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Vos palettes méritent
              <span className="relative whitespace-nowrap text-brand-600"> une seconde vie</span>.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone-600">
              Achetez, vendez ou donnez des palettes en bois près de chez vous. Paletto met en relation les
              particuliers, simplement et localement.
            </p>

            <form
              action="/annonces"
              method="get"
              role="search"
              className="mt-8 flex max-w-2xl flex-col gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-card sm:flex-row sm:items-center"
            >
              <label className="flex flex-1 items-center gap-2 px-3">
                <Search className="size-5 shrink-0 text-stone-400" aria-hidden />
                <span className="sr-only">Que recherchez-vous ?</span>
                <input
                  name="q"
                  type="search"
                  placeholder="Palette Europe, demi-palette, bois…"
                  className="h-11 w-full bg-transparent text-[15px] text-stone-900 placeholder:text-stone-400 focus:outline-none"
                />
              </label>
              <label className="flex items-center gap-2 border-t border-stone-100 px-3 sm:border-l sm:border-t-0">
                <MapPin className="size-5 shrink-0 text-stone-400" aria-hidden />
                <span className="sr-only">Département</span>
                <select
                  name="dept"
                  defaultValue=""
                  className="h-11 w-full bg-transparent text-[15px] text-stone-700 focus:outline-none sm:w-44"
                >
                  <option value="">Toute la France</option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.code} – {d.name}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className={buttonClasses({ size: "lg", className: "sm:h-12" })}>
                Rechercher
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone-600">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-forest-600" aria-hidden /> Messagerie sécurisée
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4 text-forest-600" aria-hidden /> Annonces près de chez vous
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Leaf className="size-4 text-forest-600" aria-hidden /> Geste écologique
              </span>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-white/50 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/70 shadow-card-hover">
              <PalletIllustration className="aspect-[5/4]" />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl border border-stone-200 bg-white p-4 shadow-card-hover">
              <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">En ce moment</p>
              <p className="mt-1 font-display text-2xl font-bold text-stone-900">
                {pluralize(stats.pallets, "palette")}
              </p>
              <p className="text-sm text-stone-600">disponibles sur Paletto</p>
            </div>
            <div className="absolute -right-4 top-8 flex items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-semibold shadow-card">
              <Recycle className="size-4 text-forest-600" aria-hidden />
              Zéro déchet, 100 % local
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="container-page py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Trouvez la palette qu&apos;il vous faut</h2>
            <p className="mt-2 text-stone-600">Du format Europe au bois de récup, il y en a pour tous les projets.</p>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {PALLET_TYPE_KEYS.map((key) => (
            <Link
              key={key}
              href={`/annonces?type=${key}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <PalletIllustration variant={key} className="aspect-[4/3]" />
              <div className="p-3.5">
                <p className="font-semibold text-stone-900 group-hover:text-brand-700">{PALLET_TYPES[key].short}</p>
                <p className="text-sm text-stone-500">{PALLET_TYPES[key].dimensions}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Dernières annonces */}
      <section className="container-page pb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Dernières annonces</h2>
            <p className="mt-2 text-stone-600">
              {stats.listings > 0
                ? `${pluralize(stats.listings, "annonce")} en ligne en ce moment.`
                : "Les premières annonces arrivent bientôt."}
            </p>
          </div>
          {latest.length > 0 ? (
            <Link href="/annonces" className={buttonClasses({ variant: "outline", size: "sm" })}>
              Voir toutes les annonces
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          ) : null}
        </div>

        <div className="mt-8">
          {latest.length > 0 ? (
            <ListingGrid listings={latest} favoriteIds={favoriteIds} priorityCount={4} />
          ) : (
            <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-8 sm:p-12 md:grid-cols-[1.4fr_1fr]">
              <div>
                <h3 className="text-2xl font-bold">Soyez parmi les premiers sur Paletto !</h3>
                <p className="mt-3 max-w-lg text-stone-600">
                  Vous avez des palettes qui encombrent votre garage, votre jardin ou votre atelier ? Déposez votre
                  annonce en 2 minutes : c&apos;est gratuit et vos palettes seront visibles par tous les bricoleurs de
                  votre région.
                </p>
                <Link href="/deposer" className={buttonClasses({ size: "lg", className: "mt-6" })}>
                  Déposer la première annonce
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
              <PalletIllustration className="hidden aspect-square rounded-2xl md:flex" />
            </div>
          )}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="container-page py-16">
        <div className="rounded-3xl bg-forest-900 px-6 py-14 text-forest-50 sm:px-12">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-wider text-forest-300">Comment ça marche</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Vendre ses palettes n&apos;a jamais été aussi simple
            </h2>
          </div>
          <ol className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Camera,
                title: "1. Publiez votre annonce",
                text: "Quelques photos, le type de palette, la quantité et votre prix (ou gratuit). C'est en ligne en 2 minutes.",
              },
              {
                icon: MessageCircle,
                title: "2. Échangez en toute sécurité",
                text: "Les acheteurs vous contactent via la messagerie Paletto, sans jamais voir votre e-mail.",
              },
              {
                icon: Handshake,
                title: "3. Remettez en main propre",
                text: "Convenez d'un rendez-vous, vérifiez les palettes ensemble et réglez directement entre vous.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <li key={title} className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
                <Icon className="size-8 text-brand-300" aria-hidden />
                <h3 className="mt-4 font-sans text-lg font-semibold text-white">{title}</h3>
                <p className="mt-2 leading-relaxed text-forest-100/80">{text}</p>
              </li>
            ))}
          </ol>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/deposer" className={buttonClasses({ size: "lg" })}>
              Déposer une annonce
            </Link>
            <Link
              href="/comment-ca-marche"
              className={buttonClasses({ size: "lg", variant: "ghost", className: "text-white hover:bg-white/10" })}
            >
              En savoir plus
            </Link>
          </div>
        </div>
      </section>

      {/* Pourquoi Paletto */}
      <section className="container-page pb-8">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: BadgeEuro,
              title: "Gratuit pour tous",
              text: "Aucun frais de publication, aucune commission sur la vente. Le prix affiché est celui que vous payez.",
            },
            {
              icon: MapPin,
              title: "Local avant tout",
              text: "Les palettes sont lourdes et encombrantes : trouvez-les près de chez vous grâce au filtre par département.",
            },
            {
              icon: Recycle,
              title: "Bon pour la planète",
              text: "Chaque palette réutilisée, c'est du bois qui n'est ni brûlé ni jeté. Mobilier, potager, compost : tout est possible.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-card">
              <span className="flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-4 font-sans text-lg font-semibold">{title}</h3>
              <p className="mt-2 leading-relaxed text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
