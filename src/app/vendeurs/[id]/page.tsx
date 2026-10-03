import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CalendarDays, MapPin, PackageCheck, Tag } from "lucide-react";
import { ListingGrid } from "@/components/listing-card";
import { Card, EmptyState } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { countSellerListings, getFavoriteIds, getSellerListings, getSellerProfile } from "@/lib/data/listings";
import { formatMemberSince, pluralize } from "@/lib/format";

export async function generateMetadata({ params }: PageProps<"/vendeurs/[id]">): Promise<Metadata> {
  const { id } = await params;
  const profile = await getSellerProfile(id);
  if (!profile) return { title: "Membre introuvable" };
  return {
    title: `Annonces de ${profile.display_name}`,
    description: `Découvrez les palettes proposées par ${profile.display_name} sur Paletto${profile.city ? `, à ${profile.city}` : ""}.`,
  };
}

export default async function SellerPage({ params }: PageProps<"/vendeurs/[id]">) {
  const { id } = await params;
  const profile = await getSellerProfile(id);
  if (!profile) notFound();

  const user = await getCurrentUser();
  const [listings, counts, favoriteIds] = await Promise.all([
    getSellerListings(profile.id),
    countSellerListings(profile.id),
    getFavoriteIds(user?.id),
  ]);

  return (
    <div className="container-page py-10">
      <Card className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
        <span className="flex size-20 shrink-0 items-center justify-center rounded-full bg-forest-700 font-display text-3xl font-bold text-white">
          {profile.display_name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{profile.display_name}</h1>
          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-stone-600">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden />
              Membre depuis {formatMemberSince(profile.created_at)}
            </span>
            {profile.city ? (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" aria-hidden />
                {profile.city}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <Tag className="size-4" aria-hidden />
              {pluralize(counts.active, "annonce en ligne", "annonces en ligne")}
            </span>
            {counts.sold > 0 ? (
              <span className="inline-flex items-center gap-1.5">
                <PackageCheck className="size-4" aria-hidden />
                {pluralize(counts.sold, "vente conclue", "ventes conclues")}
              </span>
            ) : null}
          </div>
          {profile.bio ? <p className="mt-4 max-w-2xl whitespace-pre-line text-stone-700">{profile.bio}</p> : null}
        </div>
      </Card>

      <section className="mt-10">
        <h2 className="text-2xl font-bold tracking-tight">Ses annonces</h2>
        <div className="mt-6">
          {listings.length > 0 ? (
            <ListingGrid listings={listings} favoriteIds={favoriteIds} showFavorite={user?.id !== profile.id} />
          ) : (
            <EmptyState title="Aucune annonce en ligne" description="Ce membre n'a pas d'annonce active pour le moment." />
          )}
        </div>
      </section>
    </div>
  );
}
