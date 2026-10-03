import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { DeleteAccountForm, ProfileForm } from "@/components/profile-forms";
import { Card, PageHeader, buttonClasses } from "@/components/ui";
import { getCurrentProfile, requireUser } from "@/lib/auth";
import { formatMemberSince } from "@/lib/format";

export const metadata: Metadata = {
  title: "Mon profil",
  robots: { index: false },
};

export default async function ProfilePage() {
  const user = await requireUser("/compte/profil");
  const profile = await getCurrentProfile();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mon profil"
        description={profile ? `Membre depuis ${formatMemberSince(profile.created_at)}` : undefined}
        actions={
          <Link href={`/vendeurs/${user.id}`} className={buttonClasses({ variant: "outline", size: "sm" })}>
            Voir mon profil public
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="p-6 sm:p-8">
          <h2 className="text-xl font-bold">Informations publiques</h2>
          <div className="mt-6">
            <ProfileForm
              defaults={{
                display_name: profile?.display_name ?? "",
                city: profile?.city ?? "",
                bio: profile?.bio ?? "",
              }}
            />
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold">Connexion</h2>
            <p className="mt-2 text-sm text-stone-600">
              Adresse e-mail : <span className="font-semibold text-stone-900">{user.email}</span>
            </p>
            <p className="mt-1 text-sm text-stone-500">Elle n&apos;est jamais visible par les autres membres.</p>
            <Link href="/compte/nouveau-mot-de-passe" className={buttonClasses({ variant: "outline", size: "sm", className: "mt-4" })}>
              <KeyRound className="size-4" aria-hidden />
              Changer de mot de passe
            </Link>
          </Card>

          <Card className="border-red-200 p-6">
            <h2 className="text-lg font-bold text-red-700">Supprimer mon compte</h2>
            <p className="mt-2 text-sm text-stone-600">
              Vos annonces, photos, favoris et conversations seront définitivement effacés.
            </p>
            <div className="mt-4">
              <DeleteAccountForm />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
