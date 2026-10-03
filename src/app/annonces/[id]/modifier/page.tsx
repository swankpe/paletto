import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ListingForm } from "@/components/listing-form";
import { updateListing } from "@/lib/actions/listings";
import { requireUser } from "@/lib/auth";
import { getListing } from "@/lib/data/listings";
import { listingImageUrl } from "@/lib/images";

export const metadata: Metadata = {
  title: "Modifier l'annonce",
  robots: { index: false },
};

export default async function EditListingPage({ params }: PageProps<"/annonces/[id]/modifier">) {
  const { id } = await params;
  const user = await requireUser(`/annonces/${id}/modifier`);
  const listing = await getListing(id);
  if (!listing || listing.seller_id !== user.id) notFound();

  return (
    <div className="container-page max-w-4xl py-10">
      <Link href={`/annonces/${listing.id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-600 hover:text-brand-700">
        <ArrowLeft className="size-4" aria-hidden />
        Retour à l&apos;annonce
      </Link>
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Modifier l&apos;annonce</h1>

      <div className="mt-8">
        <ListingForm
          action={updateListing.bind(null, listing.id)}
          userId={user.id}
          submitLabel="Enregistrer les modifications"
          initialImages={listing.images.map((path) => ({ path, url: listingImageUrl(path) ?? "" }))}
          defaults={{
            title: listing.title,
            description: listing.description,
            pallet_type: listing.pallet_type,
            condition: listing.condition,
            quantity: String(listing.quantity),
            price: listing.price_cents > 0 ? String(listing.price_cents / 100).replace(".", ",") : "",
            is_free: listing.price_cents === 0,
            price_negotiable: listing.price_negotiable,
            delivery_possible: listing.delivery_possible,
            postal_code: listing.postal_code,
            city: listing.city,
          }}
        />
      </div>
    </div>
  );
}
