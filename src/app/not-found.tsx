import Link from "next/link";
import { PalletIllustration } from "@/components/pallet-illustration";
import { buttonClasses } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="container-page flex flex-col items-center py-20 text-center">
      <PalletIllustration className="size-56 rounded-3xl" />
      <p className="mt-8 font-display text-6xl font-extrabold text-brand-500">404</p>
      <h1 className="mt-2 text-3xl font-bold">Cette page est partie avec les palettes</h1>
      <p className="mt-3 max-w-md text-stone-600">
        L&apos;annonce a peut-être été supprimée par son auteur, ou l&apos;adresse est incorrecte.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/annonces" className={buttonClasses()}>
          Voir les annonces
        </Link>
        <Link href="/" className={buttonClasses({ variant: "outline" })}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
