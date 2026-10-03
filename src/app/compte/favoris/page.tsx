import type { Metadata } from "next";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ListingGrid } from "@/components/listing-card";
import { EmptyState, PageHeader, buttonClasses } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getFavoriteListings } from "@/lib/data/listings";
import { pluralize } from "@/lib/format";

export const metadata: Metadata = {
  title: "Mes favoris",
  robots: { index: false },
};

export default async function FavoritesPage() {
  const user = await requireUser("/compte/favoris");
  const listings = await getFavoriteListings(user.id);
  const favoriteIds = new Set(listings.map((l) => l.id));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Mes favoris"
        description={listings.length > 0 ? pluralize(listings.length, "annonce sauvegardée", "annonces sauvegardées") : undefined}
      />
      {listings.length === 0 ? (
        <EmptyState
          icon={<Heart className="size-10" />}
          title="Aucun favori pour l'instant"
          description="Cliquez sur le cœur d'une annonce pour la retrouver facilement ici."
          action={
            <Link href="/annonces" className={buttonClasses()}>
              Parcourir les annonces
            </Link>
          }
        />
      ) : (
        <ListingGrid listings={listings} favoriteIds={favoriteIds} />
      )}
    </div>
  );
}
