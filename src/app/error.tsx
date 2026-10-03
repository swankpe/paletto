"use client";

import Link from "next/link";
import { useEffect } from "react";
import { buttonClasses } from "@/components/ui";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <p className="text-5xl" aria-hidden>
        🪵
      </p>
      <h1 className="mt-4 text-3xl font-bold">Oups, une planche a cédé</h1>
      <p className="mt-3 max-w-md text-stone-600">
        Une erreur inattendue est survenue. Réessayez dans un instant ; si le problème persiste, revenez plus tard.
      </p>
      {error.digest ? <p className="mt-2 font-mono text-xs text-stone-400">Référence : {error.digest}</p> : null}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={reset} className={buttonClasses()}>
          Réessayer
        </button>
        <Link href="/" className={buttonClasses({ variant: "outline" })}>
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
