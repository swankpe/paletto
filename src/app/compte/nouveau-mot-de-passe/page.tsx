import type { Metadata } from "next";
import { NewPasswordForm } from "@/components/auth-forms";
import { Card, PageHeader } from "@/components/ui";
import { requireUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Nouveau mot de passe",
  robots: { index: false },
};

export default async function NewPasswordPage() {
  await requireUser("/compte/nouveau-mot-de-passe");
  return (
    <div className="max-w-lg space-y-8">
      <PageHeader
        title="Nouveau mot de passe"
        description="8 caractères minimum. Évitez de réutiliser un ancien mot de passe."
      />
      <Card className="p-6 sm:p-8">
        <NewPasswordForm />
      </Card>
    </div>
  );
}
