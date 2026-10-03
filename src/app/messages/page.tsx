import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MessagesSquare } from "lucide-react";
import { PalletIllustration } from "@/components/pallet-illustration";
import { Badge, EmptyState, PageHeader, buttonClasses } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { getMyConversations } from "@/lib/data/messages";
import { cn } from "@/lib/cn";
import { formatRelative } from "@/lib/format";
import { listingImageUrl } from "@/lib/images";

export const metadata: Metadata = {
  title: "Messages",
  robots: { index: false },
};

export default async function MessagesPage() {
  const user = await requireUser("/messages");
  const conversations = await getMyConversations();

  return (
    <div className="space-y-8">
      <PageHeader title="Messages" description="Vos échanges avec les acheteurs et les vendeurs." />

      {conversations.length === 0 ? (
        <EmptyState
          icon={<MessagesSquare className="size-10" />}
          title="Aucune conversation"
          description="Lorsque vous contacterez un vendeur, ou qu'un acheteur vous écrira, vos échanges apparaîtront ici."
          action={
            <Link href="/annonces" className={buttonClasses()}>
              Trouver des palettes
            </Link>
          }
        />
      ) : (
        <ul className="divide-y divide-stone-100 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-card">
          {conversations.map((conversation) => {
            const image = listingImageUrl(conversation.listing_image);
            const unread = Number(conversation.unread_count) > 0;
            return (
              <li key={conversation.id}>
                <Link
                  href={`/messages/${conversation.id}`}
                  className={cn("flex items-center gap-4 p-4 transition-colors hover:bg-stone-50", unread && "bg-brand-50/50")}
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-sand">
                    {image ? (
                      <Image src={image} alt="" fill sizes="64px" className="object-cover" />
                    ) : (
                      <PalletIllustration />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className={cn("truncate text-stone-900", unread ? "font-bold" : "font-semibold")}>
                        {conversation.other_user_name}
                        <span className="ml-2 text-xs font-medium text-stone-500">
                          {conversation.is_seller ? "Acheteur" : "Vendeur"}
                        </span>
                      </p>
                      <time className="shrink-0 text-xs text-stone-500" dateTime={conversation.last_message_at}>
                        {formatRelative(conversation.last_message_at)}
                      </time>
                    </div>
                    <p className="truncate text-sm text-stone-600">
                      {conversation.listing_title ?? "Annonce supprimée"}
                      {conversation.listing_status === "sold" ? " · Vendue" : ""}
                    </p>
                    <p className={cn("mt-0.5 truncate text-sm", unread ? "font-semibold text-stone-900" : "text-stone-500")}>
                      {conversation.last_sender_id === user.id ? "Vous : " : ""}
                      {conversation.last_message}
                    </p>
                  </div>
                  {unread ? <Badge tone="brand">{conversation.unread_count}</Badge> : null}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
