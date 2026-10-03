import { createClient } from "../supabase/server";
import { isUuid } from "../validation";

export async function getMyConversations() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("my_conversations");
  if (error) throw new Error(`Impossible de charger vos conversations : ${error.message}`);
  return data ?? [];
}

export type ConversationSummary = Awaited<ReturnType<typeof getMyConversations>>[number];

export async function getUnreadCount(userId: string | undefined) {
  if (!userId) return 0;
  const supabase = await createClient();
  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .is("read_at", null)
    .neq("sender_id", userId);
  return count ?? 0;
}

export async function getConversation(id: string, userId: string) {
  if (!isUuid(id)) return null;
  const supabase = await createClient();
  const { data: conversation } = await supabase
    .from("conversations")
    .select(
      "id, listing_id, buyer_id, seller_id, created_at, listing:listings!conversations_listing_id_fkey(id, title, images, price_cents, quantity, status, city), buyer:profiles!conversations_buyer_id_fkey(id, display_name), seller:profiles!conversations_seller_id_fkey(id, display_name)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!conversation || (conversation.buyer_id !== userId && conversation.seller_id !== userId)) return null;

  const { data: messages } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at, read_at")
    .eq("conversation_id", id)
    .order("created_at", { ascending: true })
    .limit(500);

  return { conversation, messages: messages ?? [] };
}

export async function findConversationForListing(listingId: string, buyerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select("id")
    .eq("listing_id", listingId)
    .eq("buyer_id", buyerId)
    .maybeSingle();
  return data?.id ?? null;
}
