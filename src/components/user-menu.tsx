"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Heart, LayoutList, LogOut, MessageCircle, UserRound } from "lucide-react";
import { signOut } from "@/lib/actions/auth";

export function UserMenu({ displayName }: { displayName: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    function onClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex h-10 items-center gap-2 rounded-full pl-1 pr-3 text-sm font-semibold text-stone-800 hover:bg-stone-900/5"
      >
        <span className="flex size-8 items-center justify-center rounded-full bg-forest-700 text-sm font-bold text-white">
          {initial}
        </span>
        <span className="max-w-32 truncate">{displayName}</span>
        <ChevronDown className="size-4 text-stone-500" aria-hidden />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-stone-200 bg-white p-1.5 shadow-card-hover"
        >
          <MenuLink href="/compte" icon={<LayoutList className="size-4" />}>
            Mes annonces
          </MenuLink>
          <MenuLink href="/messages" icon={<MessageCircle className="size-4" />}>
            Messages
          </MenuLink>
          <MenuLink href="/compte/favoris" icon={<Heart className="size-4" />}>
            Favoris
          </MenuLink>
          <MenuLink href="/compte/profil" icon={<UserRound className="size-4" />}>
            Mon profil
          </MenuLink>
          <div className="my-1 h-px bg-stone-100" />
          <form action={signOut}>
            <button
              type="submit"
              role="menuitem"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-stone-700 hover:bg-stone-100"
            >
              <LogOut className="size-4" aria-hidden />
              Se déconnecter
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function MenuLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-100"
    >
      <span className="text-stone-500" aria-hidden>
        {icon}
      </span>
      {children}
    </Link>
  );
}
