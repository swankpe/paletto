"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { PalletIllustration } from "./pallet-illustration";

export function ImageGallery({ images, title, palletType }: { images: string[]; title: string; palletType: string }) {
  const [index, setIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const count = images.length;

  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count]);
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count]);

  useEffect(() => {
    if (!fullscreen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setFullscreen(false);
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [fullscreen, prev, next]);

  if (count === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border border-stone-200/80">
        <PalletIllustration variant={palletType} className="aspect-[4/3]" />
        <p className="bg-white px-4 py-2 text-center text-sm text-stone-500">Le vendeur n&apos;a pas encore ajouté de photo.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-900">
        <Image
          src={images[index]}
          alt={`${title} — photo ${index + 1} sur ${count}`}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-contain"
        />
        <button
          type="button"
          onClick={() => setFullscreen(true)}
          className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-sm hover:bg-white"
          aria-label="Afficher en plein écran"
        >
          <Expand className="size-4" aria-hidden />
        </button>
        {count > 1 ? (
          <>
            <GalleryArrow direction="prev" onClick={prev} />
            <GalleryArrow direction="next" onClick={next} />
            <span className="absolute bottom-3 right-3 rounded-full bg-stone-900/70 px-2.5 py-1 text-xs font-semibold text-white">
              {index + 1} / {count}
            </span>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Afficher la photo ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "relative size-20 shrink-0 overflow-hidden rounded-xl border-2 transition",
                i === index ? "border-brand-500" : "border-transparent opacity-70 hover:opacity-100",
              )}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {fullscreen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/95" role="dialog" aria-modal="true" aria-label="Photos de l'annonce">
          <button
            type="button"
            onClick={() => setFullscreen(false)}
            className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Fermer"
          >
            <X className="size-6" aria-hidden />
          </button>
          <div className="relative h-[85vh] w-[95vw]">
            <Image src={images[index]} alt={`${title} — photo ${index + 1}`} fill sizes="95vw" className="object-contain" />
          </div>
          {count > 1 ? (
            <>
              <GalleryArrow direction="prev" onClick={prev} dark />
              <GalleryArrow direction="next" onClick={next} dark />
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function GalleryArrow({ direction, onClick, dark }: { direction: "prev" | "next"; onClick: () => void; dark?: boolean }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Photo précédente" : "Photo suivante"}
      className={cn(
        "absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full shadow-sm transition",
        direction === "prev" ? "left-3" : "right-3",
        dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-white/90 text-stone-800 hover:bg-white",
      )}
    >
      <Icon className="size-5" aria-hidden />
    </button>
  );
}
