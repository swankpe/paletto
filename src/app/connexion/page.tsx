import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { SignInForm } from "@/components/auth-forms";
import { safeNextPath } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Connexion",
  description: "Connectez-vous à votre compte Paletto pour gérer vos annonces et vos messages.",
  robots: { index: false },
};

const ERRORS: Record<string, string> = {
  lien: "Ce lien de confirmation est invalide ou a expiré. Connectez-vous, ou recommencez la procédure.",
};

export default async function SignInPage({ searchParams }: PageProps<"/connexion">) {
  const params = await searchParams;
  const next = safeNextPath(params.next, "/compte");
  const error = typeof params.erreur === "string" ? ERRORS[params.erreur] : undefined;

  return (
    <AuthShell
      title="Bon retour parmi nous"
      subtitle="Connectez-vous pour contacter les vendeurs et gérer vos annonces."
      footer={
        <>
          Pas encore de compte ?{" "}
          <Link href={`/inscription?next=${encodeURIComponent(next)}`} className="font-semibold text-brand-700 hover:text-brand-800">
            Inscrivez-vous gratuitement
          </Link>
        </>
      }
    >
      {params.confirme === "1" ? (
        <p className="mb-4 rounded-xl bg-forest-50 px-4 py-3 text-sm text-forest-900">
          Adresse e-mail confirmée ! Vous pouvez vous connecter.
        </p>
      ) : null}
      <SignInForm next={next} initialError={error} />
    </AuthShell>
  );
}
