import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Eye, PackageOpen, Pencil, Plus } from "lucide-react";
import { DeleteListingButton, StatusSelect } from "@/components/my-listing-actions";
import { PalletIllustration } from "@/components/pallet-illustration";
import { Alert, Card, EmptyState, PageHeader, buttonClasses } from "@/components/ui";
import { getCurrentProfile, requireUser } from "@/lib/auth";
import { PALLET_TYPES, type PalletType } from "@/lib/constants";
import { getMyListings } from "@/lib/data/listings";
import { formatDate, formatPrice, pluralize } from "@/lib/format";
import { listingImageUrl } from "@/lib/images";

export const metadata: Metadata = {
  title: "Mes annonces",
  robots: { index: false },
};

export default async function AccountPage({ searchParams }: PageProps<"/compte">) {
  const user = await requireUser("/compte");
  const params = await searchParams;
  const [profile, listings] = await Promise.all([getCurrentProfile(), getMyListings(user.id)]);

  const active = listings.filter((l) => l.status === "active").length;
  const totalViews = listings.reduce((sum, l) => sum + (l.views ?? 0), 0);

  return (
    <div className="space-y-8">
      {params.bienvenue === "1" ? (
        <Alert tone="success">
          <strong>Bienvenue sur Paletto, {profile?.display_name} !</strong> Votre compte est prêt. Déposez votre première
          annonce ou parcourez les palettes près de chez vous.
        </Alert>
      ) : null}
      {params.supprimee === "1" ? <Alert tone="success">L&apos;annonce a été supprimée.</Alert> : null}
      {params.mdp === "1" ? <Alert tone="success">Votre mot de passe a bien été modifié.</Alert> : null}

      <PageHeader
        title="Mes annonces"
        description={
          listings.length > 0
            ? `${pluralize(active, "annonce en ligne", "annonces en ligne")} · ${pluralize(totalViews, "vue")} au total`
            : "Retrouvez ici toutes les annonces que vous avez publiées."
        }
        actions={
          <Link href="/deposer" className={buttonClasses()}>
            <Plus className="size-4" aria-hidden />
            Nouvelle annonce
          </Link>
        }
      />

      {listings.length === 0 ? (
        <EmptyState
          icon={<PackageOpen className="size-10" />}
          title="Vous n'avez pas encore d'annonce"
          description="Des palettes qui traînent ? Déposez une annonce gratuite en 2 minutes et trouvez-leur preneur près de chez vous."
          action={
            <Link href="/deposer" className={buttonClasses()}>
              Déposer ma première annonce
            </Link>
          }
        />
      ) : (
        <ul className="space-y-4">
          {listings.map((listing) => {
            const image = listingImageUrl(listing.images[0]);
            return (
              <li key={listing.id}>
                <Card className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <Link
                    href={`/annonces/${listing.id}`}
                    className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-xl bg-sand sm:w-40"
                  >
                    {image ? (
                      <Image src={image} alt={listing.title} fill sizes="160px" className="object-cover" />
                    ) : (
                      <PalletIllustration variant={listing.pallet_type} />
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={`/annonces/${listing.id}`} className="font-semibold text-stone-900 hover:text-brand-700">
                      {listing.title}
                    </Link>
                    <p className="mt-1 text-sm text-stone-600">
                      {formatPrice(listing.price_cents)}
                      {listing.price_cents > 0 ? " / palette" : ""} · {pluralize(listing.quantity, "palette")} ·{" "}
                      {PALLET_TYPES[listing.pallet_type as PalletType]?.short}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-3 text-sm text-stone-500">
                      <span>
                        {listing.city} ({listing.postal_code})
                      </span>
                      <span>Publiée le {formatDate(listing.created_at)}</span>
                      <span className="inline-flex items-center gap-1">
                        <Eye className="size-3.5" aria-hidden />
                        {pluralize(listing.views ?? 0, "vue")}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                    <StatusSelect listingId={listing.id} status={listing.status} />
                    <div className="flex gap-1">
                      <Link
                        href={`/annonces/${listing.id}/modifier`}
                        className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                      >
                        <Pencil className="size-4" aria-hidden />
                        Modifier
                      </Link>
                      <DeleteListingButton listingId={listing.id} title={listing.title} />
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
