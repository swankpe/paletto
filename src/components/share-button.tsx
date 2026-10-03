"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { buttonClasses } from "./ui";

export function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function onClick() {
    const url = window.location.href.split("?")[0];
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Partage annulé : on retombe sur la copie du lien.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Presse-papiers indisponible.
    }
  }

  return (
    <button type="button" onClick={onClick} className={buttonClasses({ variant: "outline" })}>
      {copied ? <Check className="size-4 text-forest-600" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
      {copied ? "Lien copié" : "Partager"}
    </button>
  );
}
