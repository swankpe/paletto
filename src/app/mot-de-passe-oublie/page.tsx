import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth-shell";
import { ForgotPasswordForm } from "@/components/auth-forms";

export const metadata: Metadata = {
  title: "Mot de passe oublié",
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Mot de passe oublié ?"
      subtitle="Indiquez votre adresse e-mail : nous vous enverrons un lien pour en choisir un nouveau."
      footer={
        <Link href="/connexion" className="font-semibold text-brand-700 hover:text-brand-800">
          ← Retour à la connexion
        </Link>
      }
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
