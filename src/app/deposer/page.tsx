import type { Metadata } from "next";
import { Lightbulb } from "lucide-react";
import { ListingForm } from "@/components/listing-form";
import { requireUser, getCurrentProfile } from "@/lib/auth";
import { createListing } from "@/lib/actions/listings";

export const metadata: Metadata = {
  title: "Déposer une annonce",
  description: "Vendez ou donnez vos palettes gratuitement en quelques minutes sur Paletto.",
  robots: { index: false },
};

export default async function NewListingPage() {
  const user = await requireUser("/deposer");
  const profile = await getCurrentProfile();

  return (
    <div className="container-page max-w-4xl py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Déposer une annonce</h1>
      <p className="mt-2 text-stone-600">Gratuit, sans commission, en ligne en 2 minutes.</p>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-brand-900">
        <Lightbulb className="mt-0.5 size-5 shrink-0" aria-hidden />
        <p>
          <strong>Astuce :</strong> une annonce avec 3 photos nettes, la quantité exacte et un prix clair reçoit jusqu&apos;à
          trois fois plus de messages.
        </p>
      </div>

      <div className="mt-8">
        <ListingForm
          action={createListing}
          userId={user.id}
          initialImages={[]}
          submitLabel="Publier mon annonce"
          defaults={{
            title: "",
            description: "",
            pallet_type: "europe",
            condition: "",
            quantity: "1",
            price: "",
            is_free: false,
            price_negotiable: false,
            delivery_possible: false,
            postal_code: "",
            city: profile?.city ?? "",
          }}
        />
      </div>
    </div>
  );
}
