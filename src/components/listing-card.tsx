import Image from "next/image";
import Link from "next/link";
import { MapPin, Truck } from "lucide-react";
import { CONDITIONS, PALLET_TYPES, type Condition, type PalletType } from "@/lib/constants";
import type { ListingCardData } from "@/lib/data/listings";
import { formatPrice, formatRelative } from "@/lib/format";
import { listingImageUrl } from "@/lib/images";
import { FavoriteButton } from "./favorite-button";
import { PalletIllustration } from "./pallet-illustration";
import { Badge } from "./ui";

export function ListingCard({
  listing,
  favorited,
  showFavorite = true,
  priority = false,
}: {
  listing: ListingCardData;
  favorited?: boolean;
  showFavorite?: boolean;
  priority?: boolean;
}) {
  const image = listingImageUrl(listing.images[0]);
  const type = PALLET_TYPES[listing.pallet_type as PalletType];
  const condition = CONDITIONS[listing.condition as Condition];

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-card transition-shadow duration-200 hover:shadow-card-hover">
      <div className="relative aspect-[4/3] overflow-hidden bg-sand">
        {image ? (
          <Image
            src={image}
            alt={listing.title}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 300px, (min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <PalletIllustration variant={listing.pallet_type} />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {listing.status === "reserved" ? <Badge tone="dark">Réservée</Badge> : null}
          {listing.status === "sold" ? <Badge tone="dark">Vendue</Badge> : null}
          {listing.price_cents === 0 ? <Badge tone="green">Gratuit</Badge> : null}
        </div>
        {showFavorite ? (
          <div className="absolute right-3 top-3 z-10">
            <FavoriteButton listingId={listing.id} initialFavorited={Boolean(favorited)} />
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-lg font-bold text-stone-900">
            {formatPrice(listing.price_cents)}
            {listing.price_cents > 0 ? <span className="text-sm font-medium text-stone-500"> /u.</span> : null}
          </p>
          <p className="shrink-0 text-sm font-semibold text-forest-700">× {listing.quantity.toLocaleString("fr-FR")}</p>
        </div>
        <h3 className="mt-1 line-clamp-2 font-sans text-[15px] font-semibold leading-snug text-stone-800">
          <Link href={`/annonces/${listing.id}`} className="after:absolute after:inset-0 after:content-['']">
            {listing.title}
          </Link>
        </h3>
        <p className="mt-1.5 text-sm text-stone-500">
          {type?.short ?? "Palette"} · {condition?.label ?? ""}
        </p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-sm text-stone-500">
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">
              {listing.city} ({listing.postal_code.slice(0, 2)})
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-2">
            {listing.delivery_possible ? (
              <Truck className="size-4 text-forest-600" aria-label="Livraison possible" />
            ) : null}
            <time dateTime={listing.created_at}>{formatRelative(listing.created_at)}</time>
          </span>
        </div>
      </div>
    </article>
  );
}

export function ListingGrid({
  listings,
  favoriteIds,
  showFavorite = true,
  priorityCount = 0,
}: {
  listings: ListingCardData[];
  favoriteIds?: Set<string>;
  showFavorite?: boolean;
  priorityCount?: number;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {listings.map((listing, index) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          favorited={favoriteIds?.has(listing.id)}
          showFavorite={showFavorite}
          priority={index < priorityCount}
        />
      ))}
    </div>
  );
}
