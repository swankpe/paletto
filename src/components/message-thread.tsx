"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { markConversationRead, sendMessage } from "@/lib/actions/messages";
import { initialFormState } from "@/lib/actions/types";
import { cn } from "@/lib/cn";
import { formatMessageTime } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import { SubmitButton } from "./submit-button";

export type ThreadMessage = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};

function mergeMessages(a: ThreadMessage[], b: ThreadMessage[]) {
  const map = new Map<string, ThreadMessage>();
  for (const message of [...a, ...b]) map.set(message.id, { ...map.get(message.id), ...message });
  return [...map.values()].sort((x, y) => x.created_at.localeCompare(y.created_at));
}

export function MessageThread({
  conversationId,
  currentUserId,
  otherName,
  initialMessages,
  hasUnread,
}: {
  conversationId: string;
  currentUserId: string;
  otherName: string;
  initialMessages: ThreadMessage[];
  hasUnread: boolean;
}) {
  // Messages reçus en temps réel, fusionnés avec ceux rendus par le serveur
  // (la page est revalidée après chaque envoi).
  const [liveMessages, setLiveMessages] = useState<ThreadMessage[]>([]);
  const messages = useMemo(() => mergeMessages(liveMessages, initialMessages), [liveMessages, initialMessages]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [now, setNow] = useState(() => new Date());
  const [realtimeReady, setRealtimeReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (hasUnread) void markConversationRead(conversationId);
  }, [conversationId, hasUnread]);

  // Temps réel : nouveaux messages de l'interlocuteur.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `conversation_id=eq.${conversationId}` },
        (payload) => {
          const message = payload.new as ThreadMessage & { conversation_id: string };
          setLiveMessages((prev) => mergeMessages(prev, [message]));
          if (message.sender_id !== currentUserId) void markConversationRead(conversationId);
        },
      )
      .subscribe((status) => setRealtimeReady(status === "SUBSCRIBED"));
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [conversationId, currentUserId]);

  // Repli si le temps réel est indisponible (réseau qui bloque les WebSockets…) :
  // la conversation est rechargée régulièrement tant que l'onglet est visible.
  useEffect(() => {
    if (realtimeReady) return;
    const timer = setInterval(() => {
      if (document.visibilityState === "visible") router.refresh();
    }, 8_000);
    return () => clearInterval(timer);
  }, [realtimeReady, router]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
        {messages.map((message) => {
          const mine = message.sender_id === currentUserId;
          return (
            <div key={message.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
              <div className="max-w-[85%] sm:max-w-[70%]">
                <div
                  className={cn(
                    "whitespace-pre-line break-words rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed",
                    mine ? "rounded-br-md bg-brand-500 text-white" : "rounded-bl-md bg-white text-stone-800 ring-1 ring-stone-200",
                  )}
                >
                  <span className="sr-only">{mine ? "Vous : " : `${otherName} : `}</span>
                  {message.body}
                </div>
                <p className={cn("mt-1 text-xs text-stone-500", mine ? "text-right" : "text-left")}>
                  {formatMessageTime(message.created_at, now)}
                  {mine && message.read_at ? " · Lu" : ""}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
      <MessageComposer conversationId={conversationId} />
    </div>
  );
}

function MessageComposer({ conversationId }: { conversationId: string }) {
  const [state, action] = useActionState(sendMessage.bind(null, conversationId), initialFormState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form ref={formRef} action={action} className="border-t border-stone-200 bg-white p-3 sm:p-4">
      {state.error ? <p className="mb-2 text-sm font-medium text-red-600">{state.error}</p> : null}
      <div className="flex items-end gap-2">
        <label htmlFor="message-body" className="sr-only">
          Votre message
        </label>
        <textarea
          id="message-body"
          name="body"
          required
          maxLength={2000}
          rows={1}
          placeholder="Écrivez votre message…"
          defaultValue={state.error ? state.values?.body : ""}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              if (event.currentTarget.value.trim()) formRef.current?.requestSubmit();
            }
          }}
          className="max-h-40 min-h-11 flex-1 resize-none rounded-2xl border border-stone-300 bg-white px-4 py-2.5 text-[15px] leading-relaxed placeholder:text-stone-400 focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 field-sizing-content"
        />
        <SubmitButton className="size-11 shrink-0 px-0" pendingLabel="">
          <SendHorizontal className="size-5" aria-hidden />
          <span className="sr-only">Envoyer</span>
        </SubmitButton>
      </div>
      <p className="mt-2 hidden text-xs text-stone-400 sm:block">Entrée pour envoyer · Maj + Entrée pour un retour à la ligne</p>
    </form>
  );
}
