"use server";

import { refresh, revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "../auth";
import { createClient } from "../supabase/server";
import { isUuid, messageSchema } from "../validation";
import type { FormState } from "./types";

export async function contactSeller(listingId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect(`/connexion?next=${encodeURIComponent(`/annonces/${listingId}`)}`);
  if (!isUuid(listingId)) return { error: "Annonce introuvable." };

  const body = messageSchema.safeParse(formData.get("body"));
  if (!body.success) {
    return { fieldErrors: { body: body.error.issues[0]?.message ?? "Message invalide." }, values: { body: String(formData.get("body") ?? "") } };
  }

  const supabase = await createClient();
  const { data: conversationId, error } = await supabase.rpc("start_conversation", {
    p_listing_id: listingId,
    p_body: body.data,
  });

  if (error || !conversationId) {
    const known = [
      "Vous ne pouvez pas répondre à votre propre annonce.",
      "Cette annonce est déjà vendue.",
      "Annonce introuvable.",
    ];
    const message = error && known.includes(error.message) ? error.message : "L'envoi a échoué. Réessayez.";
    return { error: message, values: { body: body.data } };
  }

  revalidatePath("/messages");
  redirect(`/messages/${conversationId}`);
}

export async function sendMessage(conversationId: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();
  if (!user) redirect(`/connexion?next=${encodeURIComponent(`/messages/${conversationId}`)}`);
  if (!isUuid(conversationId)) return { error: "Conversation introuvable." };

  const body = messageSchema.safeParse(formData.get("body"));
  if (!body.success) return { error: body.error.issues[0]?.message ?? "Message invalide." };

  const supabase = await createClient();
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body: body.data,
  });
  if (error) return { error: "L'envoi a échoué. Réessayez.", values: { body: body.data } };

  revalidatePath(`/messages/${conversationId}`);
  revalidatePath("/messages");
  return { success: "sent" };
}

export async function markConversationRead(conversationId: string) {
  const user = await getCurrentUser();
  if (!user || !isUuid(conversationId)) return;
  const supabase = await createClient();
  await supabase.rpc("mark_conversation_read", { p_conversation_id: conversationId });
  // Met à jour le badge « messages non lus » de l'en-tête.
  refresh();
}
