import type { Metadata } from "next";
import { AuthShell } from "@/components/auth-shell";
import { NewPasswordForm } from "@/components/auth-forms";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Nouveau mot de passe",
  robots: { index: false },
};

export default async function NewPasswordPage() {
  await requireUser("/compte/nouveau-mot-de-passe");
  return (
    <AuthShell title="Choisissez un nouveau mot de passe" subtitle="8 caractères minimum. Évitez de réutiliser un ancien mot de passe.">
      <NewPasswordForm />
    </AuthShell>
  );
}
