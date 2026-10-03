import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { SignUpForm } from "@/components/auth-forms";
import { safeNextPath } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Créer un compte",
  description: "Inscrivez-vous gratuitement sur Paletto pour acheter, vendre ou donner des palettes entre particuliers.",
};

export default async function SignUpPage({ searchParams }: PageProps<"/inscription">) {
  const params = await searchParams;
  const next = safeNextPath(params.next, "/compte");

  return (
    <AuthShell
      title="Créez votre compte"
      subtitle="Gratuit et sans engagement. Il ne faut que 30 secondes."
      footer={
        <>
          Déjà inscrit ?{" "}
          <Link href={`/connexion?next=${encodeURIComponent(next)}`} className="font-semibold text-brand-700 hover:text-brand-800">
            Connectez-vous
          </Link>
        </>
      }
    >
      <SignUpForm next={next} />
    </AuthShell>
  );
}
