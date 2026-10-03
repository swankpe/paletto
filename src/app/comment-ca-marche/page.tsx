import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeEuro,
  Camera,
  CircleCheck,
  Handshake,
  MessageCircle,
  Search,
  ShieldAlert,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { buttonClasses } from "@/components/ui";
import { PALLET_TYPES, PALLET_TYPE_KEYS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Comment ça marche",
  description:
    "Vendre, acheter ou donner des palettes entre particuliers avec Paletto : mode d'emploi, conseils de sécurité, guide des types de palettes et questions fréquentes.",
  alternates: { canonical: "/comment-ca-marche" },
};

const FAQ = [
  {
    q: "Paletto est-il vraiment gratuit ?",
    a: "Oui. Publier une annonce, contacter un vendeur et utiliser la messagerie sont entièrement gratuits. Paletto ne prend aucune commission : le paiement se fait directement entre l'acheteur et le vendeur.",
  },
  {
    q: "Comment se passe le paiement ?",
    a: "Le paiement se règle de la main à la main au moment du retrait (espèces, virement instantané, application de paiement…), une fois que l'acheteur a vérifié les palettes. Paletto n'intervient pas dans la transaction.",
  },
  {
    q: "Combien vaut une palette d'occasion ?",
    a: "Tout dépend du format et de l'état. À titre indicatif, une palette Europe (EPAL) en bon état se négocie souvent entre 5 et 12 €, une palette perdue entre 0 et 3 €. Les palettes abîmées sont souvent données pour le bois de récupération.",
  },
  {
    q: "Puis-je donner mes palettes gratuitement ?",
    a: "Bien sûr ! Cochez simplement « Je donne mes palettes gratuitement » lors du dépôt de l'annonce. Les annonces gratuites trouvent preneur très rapidement.",
  },
  {
    q: "Comment savoir si une palette est traitée ?",
    a: "Repérez les marquages au fer sur les dés : « HT » signifie traitement thermique (sans produit chimique), idéal pour le mobilier ou le potager. Évitez le marquage « MB » (bromure de méthyle, interdit en Europe) pour tout usage intérieur ou alimentaire.",
  },
  {
    q: "Mon adresse e-mail est-elle visible ?",
    a: "Non. Les échanges passent par la messagerie Paletto. Seuls votre pseudo et la ville de l'annonce sont publics. Vous décidez ensuite de ce que vous partagez avec votre interlocuteur.",
  },
  {
    q: "Comment marquer mes palettes comme vendues ?",
    a: "Depuis « Mes annonces », changez le statut de l'annonce en « Réservée » ou « Vendue ». Une annonce vendue n'apparaît plus dans les résultats de recherche.",
  },
  {
    q: "J'ai repéré une annonce suspecte, que faire ?",
    a: "Utilisez le lien « Signaler cette annonce » en bas de chaque annonce. Notre équipe examine chaque signalement et retire les contenus frauduleux.",
  },
];

export default function HowItWorksPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <section className="wood-texture border-b border-stone-200/70">
        <div className="container-page py-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Comment ça marche ?</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            Paletto met en relation les particuliers qui ont des palettes en trop et ceux qui en cherchent. Simple, gratuit et
            local.
          </p>
        </div>
      </section>

      <div className="container-page py-16">
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-card">
            <p className="text-sm font-bold uppercase tracking-wider text-brand-600">Vous vendez ou donnez</p>
            <h2 className="mt-2 text-2xl font-bold">Videz votre garage en 3 étapes</h2>
            <ol className="mt-6 space-y-6">
              <Step icon={<Camera className="size-5" />} title="Déposez votre annonce">
                Ajoutez quelques photos, le type de palette, la quantité, l&apos;état et votre prix — ou indiquez que vous les donnez.
              </Step>
              <Step icon={<MessageCircle className="size-5" />} title="Répondez aux messages">
                Les acheteurs intéressés vous écrivent sur la messagerie Paletto. Convenez d&apos;un créneau pour le retrait.
              </Step>
              <Step icon={<CircleCheck className="size-5" />} title="Marquez l'annonce comme vendue">
                Une fois les palettes parties, passez l&apos;annonce en « Vendue » depuis votre espace.
              </Step>
            </ol>
            <Link href="/deposer" className={buttonClasses({ className: "mt-8" })}>
              Déposer une annonce
            </Link>
          </section>

          <section className="rounded-3xl border border-stone-200/80 bg-white p-8 shadow-card">
            <p className="text-sm font-bold uppercase tracking-wider text-forest-600">Vous cherchez des palettes</p>
            <h2 className="mt-2 text-2xl font-bold">Trouvez la bonne affaire près de chez vous</h2>
            <ol className="mt-6 space-y-6">
              <Step icon={<Search className="size-5" />} title="Recherchez" tone="forest">
                Filtrez par type, état, département ou prix. Les palettes gratuites sont repérables en un clic.
              </Step>
              <Step icon={<MessageCircle className="size-5" />} title="Contactez le vendeur" tone="forest">
                Posez vos questions (dimensions exactes, marquage HT, quantité) et organisez le retrait.
              </Step>
              <Step icon={<Handshake className="size-5" />} title="Récupérez vos palettes" tone="forest">
                Vérifiez l&apos;état sur place, réglez directement le vendeur et repartez avec votre lot.
              </Step>
            </ol>
            <Link href="/annonces" className={buttonClasses({ variant: "forest", className: "mt-8" })}>
              Voir les annonces
            </Link>
          </section>
        </div>

        <section className="mt-20">
          <h2 className="text-3xl font-bold tracking-tight">Le guide des palettes</h2>
          <p className="mt-2 max-w-2xl text-stone-600">Choisissez le bon format selon votre projet.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PALLET_TYPE_KEYS.map((key) => (
              <Link
                key={key}
                href={`/annonces?type=${key}`}
                className="rounded-2xl border border-stone-200/80 bg-white p-6 shadow-card transition hover:shadow-card-hover"
              >
                <p className="text-lg font-semibold text-stone-900">{PALLET_TYPES[key].label}</p>
                <p className="mt-1 text-sm font-semibold text-brand-700">{PALLET_TYPES[key].dimensions}</p>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{PALLET_TYPES[key].description}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="securite" className="mt-20 scroll-mt-24 rounded-3xl bg-forest-900 p-8 text-forest-50 sm:p-12">
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-8 text-forest-300" aria-hidden />
            <h2 className="text-3xl font-bold tracking-tight text-white">Échangez en toute sécurité</h2>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Tip icon={<Handshake className="size-5" />} title="Privilégiez la remise en main propre">
              Vérifiez les palettes sur place avant de payer. C&apos;est le moyen le plus sûr pour l&apos;acheteur comme pour le
              vendeur.
            </Tip>
            <Tip icon={<BadgeEuro className="size-5" />} title="Pas de paiement à l'avance">
              Ne versez jamais d&apos;acompte à un inconnu, surtout par mandat cash, coupon prépayé ou crypto-monnaie.
            </Tip>
            <Tip icon={<ShieldAlert className="size-5" />} title="Méfiez-vous des offres trop belles">
              Un acheteur qui propose plus que le prix, veut payer « via un transporteur » ou vous demande un code reçu par
              SMS est très probablement un escroc.
            </Tip>
            <Tip icon={<Truck className="size-5" />} title="Prévoyez le transport">
              Une palette Europe pèse environ 25 kg. Prévoyez un véhicule adapté, des gants et de l&apos;aide pour le
              chargement.
            </Tip>
          </div>
        </section>

        <section id="faq" className="mt-20 scroll-mt-24">
          <h2 className="text-3xl font-bold tracking-tight">Questions fréquentes</h2>
          <div className="mt-8 divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-card">
            {FAQ.map(({ q, a }) => (
              <details key={q} className="group p-5 sm:p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-stone-900 [&::-webkit-details-marker]:hidden">
                  {q}
                  <span className="text-2xl leading-none text-brand-500 transition-transform group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </summary>
                <p className="mt-3 leading-relaxed text-stone-600">{a}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function Step({
  icon,
  title,
  children,
  tone = "brand",
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  tone?: "brand" | "forest";
}) {
  return (
    <li className="flex gap-4">
      <span
        className={
          tone === "brand"
            ? "flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700"
            : "flex size-11 shrink-0 items-center justify-center rounded-xl bg-forest-100 text-forest-700"
        }
        aria-hidden
      >
        {icon}
      </span>
      <div>
        <h3 className="font-sans font-semibold text-stone-900">{title}</h3>
        <p className="mt-1 leading-relaxed text-stone-600">{children}</p>
      </div>
    </li>
  );
}

function Tip({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/5 p-6 ring-1 ring-white/10">
      <div className="flex items-center gap-2 text-brand-300">
        {icon}
        <h3 className="font-sans font-semibold text-white">{title}</h3>
      </div>
      <p className="mt-2 leading-relaxed text-forest-100/80">{children}</p>
    </div>
  );
}
