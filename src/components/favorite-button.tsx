"use client";

import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleFavorite } from "@/lib/actions/listings";
import { cn } from "@/lib/cn";

export function FavoriteButton({
  listingId,
  initialFavorited,
  variant = "overlay",
}: {
  listingId: string;
  initialFavorited: boolean;
  variant?: "overlay" | "full";
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const pathname = usePathname();

  function onClick(event: React.MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    const previous = favorited;
    setFavorited(!previous);
    startTransition(async () => {
      const result = await toggleFavorite(listingId);
      if (result.needsAuth) {
        setFavorited(previous);
        router.push(`/connexion?next=${encodeURIComponent(pathname)}`);
        return;
      }
      if (result.error || typeof result.favorited !== "boolean") {
        setFavorited(previous);
        return;
      }
      setFavorited(result.favorited);
    });
  }

  const label = favorited ? "Retirer des favoris" : "Ajouter aux favoris";

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        aria-pressed={favorited}
        className={cn(
          "inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-semibold transition-colors",
          favorited
            ? "border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100"
            : "border-stone-300 bg-white text-stone-800 hover:bg-stone-50",
        )}
      >
        <Heart className={cn("size-4", favorited && "fill-current")} aria-hidden />
        {favorited ? "Dans vos favoris" : "Ajouter aux favoris"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      aria-pressed={favorited}
      aria-label={label}
      title={label}
      className="flex size-9 items-center justify-center rounded-full bg-white/90 text-stone-700 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-white"
    >
      <Heart className={cn("size-[18px]", favorited && "fill-brand-500 text-brand-500")} aria-hidden />
    </button>
  );
}
