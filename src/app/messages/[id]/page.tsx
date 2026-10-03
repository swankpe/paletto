import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { MessageThread } from "@/components/message-thread";
import { PalletIllustration } from "@/components/pallet-illustration";
import { Badge } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getConversation } from "@/lib/data/messages";
import { formatPrice } from "@/lib/format";
import { listingImageUrl } from "@/lib/images";

export const metadata: Metadata = {
  title: "Conversation",
  robots: { index: false },
};

function one<T>(value: T | T[] | null): T | null {
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export default async function ConversationPage({ params }: PageProps<"/messages/[id]">) {
  const { id } = await params;
  const user = await requireUser(`/messages/${id}`);
  const data = await getConversation(id, user.id);
  if (!data) notFound();

  const { conversation, messages } = data;
  const listing = one(conversation.listing);
  const buyer = one(conversation.buyer);
  const seller = one(conversation.seller);
  const isSeller = conversation.seller_id === user.id;
  const other = isSeller ? buyer : seller;
  const image = listingImageUrl(listing?.images?.[0]);
  const hasUnread = messages.some((m) => m.sender_id !== user.id && !m.read_at);

  return (
    <div className="mx-auto flex h-[calc(100dvh-14rem)] min-h-[520px] max-w-3xl flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-50 shadow-card">
      <div className="flex items-center gap-3 border-b border-stone-200 bg-white p-3 sm:p-4">
        <Link
          href="/messages"
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100"
          aria-label="Retour aux messages"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </Link>
        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-sand">
          {image ? <Image src={image} alt="" fill sizes="48px" className="object-cover" /> : <PalletIllustration />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-stone-900">
            {other?.display_name ?? "Membre"}{" "}
            <span className="text-xs font-medium text-stone-500">{isSeller ? "· acheteur" : "· vendeur"}</span>
          </p>
          {listing ? (
            <Link href={`/annonces/${listing.id}`} className="block truncate text-sm text-stone-600 hover:text-brand-700">
              {listing.title} · {formatPrice(listing.price_cents)}
              {listing.price_cents > 0 ? "/u." : ""}
            </Link>
          ) : (
            <p className="text-sm text-stone-500">Annonce supprimée</p>
          )}
        </div>
        {listing?.status === "reserved" ? <Badge tone="amber">Réservée</Badge> : null}
        {listing?.status === "sold" ? <Badge tone="red">Vendue</Badge> : null}
      </div>

      <div className="flex items-start gap-2 border-b border-forest-100 bg-forest-50 px-4 py-2.5 text-xs leading-relaxed text-forest-900 sm:px-6">
        <ShieldCheck className="mt-0.5 size-4 shrink-0" aria-hidden />
        <p>
          Rencontrez-vous dans un lieu sûr et vérifiez les palettes avant de payer. Ne transmettez jamais de code reçu par
          SMS ni vos coordonnées bancaires.
        </p>
      </div>

      <MessageThread
        conversationId={conversation.id}
        currentUserId={user.id}
        otherName={other?.display_name ?? "Membre"}
        initialMessages={messages}
        hasUnread={hasUnread}
      />
    </div>
  );
}
