"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import { LISTING_IMAGES_BUCKET } from "../constants";
import { createClient } from "../supabase/server";
import { fieldErrorsFrom, isUuid, listingSchema, reportSchema, statusSchema } from "../validation";
import { formValues, type FormState } from "./types";

const LISTING_FIELDS = [
  "title",
  "description",
  "pallet_type",
  "condition",
  "quantity",
  "price",
  "is_free",
  "price_negotiable",
  "delivery_possible",
  "postal_code",
  "city",
  "images",
];

function parseListingForm(formData: FormData) {
  const raw = Object.fromEntries(LISTING_FIELDS.map((key) => [key, formData.get(key) ?? undefined]));
  return listingSchema.safeParse(raw);
}

function ownsAllImages(images: string[], userId: string) {
  return images.every((path) => path.startsWith(`${userId}/`) && !path.includes(".."));
}

export async function createListing(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/deposer");

  const values = formValues(formData, LISTING_FIELDS);
  const parsed = parseListingForm(formData);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error), values, error: "Certains champs sont à corriger." };
  }
  if (!ownsAllImages(parsed.data.images, user.id)) {
    return { error: "Photos invalides. Rechargez la page et réessayez.", values };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .insert({ ...parsed.data, seller_id: user.id })
    .select("id")
    .single();

  if (error || !data) {
    return { error: "La publication a échoué. Réessayez dans un instant.", values };
  }

  revalidatePath("/");
  revalidatePath("/annonces");
  revalidatePath("/compte");
  redirect(`/annonces/${data.id}?publiee=1`);
}

export async function updateListing(listingId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect(`/connexion?next=/annonces/${listingId}/modifier`);
  if (!isUuid(listingId)) return { error: "Annonce introuvable." };

  const values = formValues(formData, LISTING_FIELDS);
  const parsed = parseListingForm(formData);
  if (!parsed.success) {
    return { fieldErrors: fieldErrorsFrom(parsed.error), values, error: "Certains champs sont à corriger." };
  }
  if (!ownsAllImages(parsed.data.images, user.id)) {
    return { error: "Photos invalides. Rechargez la page et réessayez.", values };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("listings")
    .select("id, images")
    .eq("id", listingId)
    .eq("seller_id", user.id)
    .maybeSingle();
  if (!existing) return { error: "Vous ne pouvez pas modifier cette annonce." };

  const { error } = await supabase
    .from("listings")
    .update(parsed.data)
    .eq("id", listingId)
    .eq("seller_id", user.id);
  if (error) return { error: "La mise à jour a échoué. Réessayez.", values };

  const removed = existing.images.filter((path) => !parsed.data.images.includes(path));
  if (removed.length > 0) {
    await supabase.storage.from(LISTING_IMAGES_BUCKET).remove(removed);
  }

  revalidatePath("/");
  revalidatePath("/annonces");
  revalidatePath(`/annonces/${listingId}`);
  revalidatePath("/compte");
  redirect(`/annonces/${listingId}?modifiee=1`);
}

export async function deleteListing(listingId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/compte");
  if (!isUuid(listingId)) return;

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("listings")
    .select("images")
    .eq("id", listingId)
    .eq("seller_id", user.id)
    .maybeSingle();
  if (!existing) return;

  const { error } = await supabase.from("listings").delete().eq("id", listingId).eq("seller_id", user.id);
  if (error) throw new Error("La suppression a échoué.");

  if (existing.images.length > 0) {
    await supabase.storage.from(LISTING_IMAGES_BUCKET).remove(existing.images);
  }

  revalidatePath("/");
  revalidatePath("/annonces");
  revalidatePath("/compte");
  redirect("/compte?supprimee=1");
}

export async function setListingStatus(listingId: string, formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/compte");
  const status = statusSchema.safeParse(formData.get("status"));
  if (!isUuid(listingId) || !status.success) return;

  const supabase = await createClient();
  await supabase.from("listings").update({ status: status.data }).eq("id", listingId).eq("seller_id", user.id);

  revalidatePath("/");
  revalidatePath("/annonces");
  revalidatePath(`/annonces/${listingId}`);
  revalidatePath("/compte");
}

export async function toggleFavorite(
  listingId: string,
): Promise<{ favorited?: boolean; error?: string; needsAuth?: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { needsAuth: true };
  if (!isUuid(listingId)) return { error: "Annonce introuvable." };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("favorites")
    .select("listing_id")
    .eq("user_id", user.id)
    .eq("listing_id", listingId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("listing_id", listingId);
    if (error) return { error: "Impossible de retirer ce favori." };
    revalidatePath("/compte/favoris");
    return { favorited: false };
  }

  const { error } = await supabase.from("favorites").insert({ user_id: user.id, listing_id: listingId });
  if (error && error.code !== "23505") return { error: "Impossible d'ajouter ce favori." };
  revalidatePath("/compte/favoris");
  return { favorited: true };
}

export async function reportListing(listingId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Connectez-vous pour signaler une annonce." };
  if (!isUuid(listingId)) return { error: "Annonce introuvable." };

  const parsed = reportSchema.safeParse({
    reason: formData.get("reason"),
    details: formData.get("details") ?? undefined,
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const supabase = await createClient();
  const { error } = await supabase.from("reports").insert({
    listing_id: listingId,
    reporter_id: user.id,
    reason: parsed.data.reason,
    details: parsed.data.details,
  });

  if (error?.code === "23505") return { success: "Vous avez déjà signalé cette annonce. Merci !" };
  if (error) return { error: "Le signalement a échoué. Réessayez." };
  return { success: "Merci, votre signalement a bien été transmis à notre équipe." };
}
