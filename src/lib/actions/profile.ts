"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import { LISTING_IMAGES_BUCKET } from "../constants";
import { createAdminClient } from "../supabase/admin";
import { createClient } from "../supabase/server";
import { fieldErrorsFrom, profileSchema } from "../validation";
import { formValues, type FormState } from "./types";

export async function updateProfile(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/compte/profil");

  const values = formValues(formData, ["display_name", "city", "bio"]);
  const parsed = profileSchema.safeParse({
    display_name: formData.get("display_name"),
    city: formData.get("city") ?? undefined,
    bio: formData.get("bio") ?? undefined,
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), values };

  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update(parsed.data).eq("id", user.id);
  if (error) return { error: "L'enregistrement a échoué. Réessayez.", values };

  revalidatePath("/", "layout");
  return { success: "Votre profil a été mis à jour.", values };
}

export async function deleteAccount(_prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/connexion?next=/compte/profil");

  if (String(formData.get("confirm") ?? "").trim().toUpperCase() !== "SUPPRIMER") {
    return { fieldErrors: { confirm: "Tapez SUPPRIMER pour confirmer." } };
  }

  const admin = createAdminClient();
  if (!admin) {
    return {
      error:
        "La suppression automatique n'est pas encore activée. Contactez-nous via la page Mentions légales et nous supprimerons votre compte sous 30 jours.",
    };
  }

  const supabase = await createClient();

  // 1. Supprimer les photos de l'utilisateur.
  const { data: files } = await supabase.storage.from(LISTING_IMAGES_BUCKET).list(user.id, { limit: 1000 });
  if (files && files.length > 0) {
    await supabase.storage.from(LISTING_IMAGES_BUCKET).remove(files.map((file) => `${user.id}/${file.name}`));
  }

  // 2. Supprimer le compte : le profil, les annonces, favoris et messages suivent en cascade.
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return { error: "La suppression a échoué. Réessayez ou contactez-nous." };

  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/?compte=supprime");
}
