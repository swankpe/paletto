"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useRef, useTransition } from "react";
import { deleteListing, setListingStatus } from "@/lib/actions/listings";
import { LISTING_STATUSES, LISTING_STATUS_KEYS } from "@/lib/constants";
import { cn } from "@/lib/cn";

export function StatusSelect({ listingId, status }: { listingId: string; status: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const action = setListingStatus.bind(null, listingId);

  return (
    <form ref={formRef} action={(formData) => startTransition(() => action(formData))} className="flex items-center gap-2">
      <label className="sr-only" htmlFor={`status-${listingId}`}>
        Statut de l&apos;annonce
      </label>
      <select
        id={`status-${listingId}`}
        name="status"
        defaultValue={status}
        disabled={pending}
        onChange={() => formRef.current?.requestSubmit()}
        className={cn(
          "h-9 rounded-full border px-3 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-brand-500/15",
          status === "active" && "border-forest-200 bg-forest-50 text-forest-800",
          status === "reserved" && "border-amber-200 bg-amber-50 text-amber-800",
          status === "sold" && "border-stone-200 bg-stone-100 text-stone-700",
        )}
      >
        {LISTING_STATUS_KEYS.map((key) => (
          <option key={key} value={key}>
            {LISTING_STATUSES[key].label}
          </option>
        ))}
      </select>
      {pending ? <Loader2 className="size-4 animate-spin text-stone-400" aria-label="Mise à jour" /> : null}
    </form>
  );
}

export function DeleteListingButton({ listingId, title }: { listingId: string; title: string }) {
  const [pending, startTransition] = useTransition();

  function onClick() {
    if (!window.confirm(`Supprimer définitivement l'annonce « ${title} » ? Cette action est irréversible.`)) return;
    startTransition(async () => {
      await deleteListing(listingId);
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-stone-600 hover:bg-red-50 hover:text-red-700 disabled:opacity-60"
    >
      {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
      Supprimer
    </button>
  );
}
