"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Heart, LayoutList, LogIn, LogOut, Menu, MessageCircle, Plus, Search, UserRound, X } from "lucide-react";
import { signOut } from "@/lib/actions/auth";
import { buttonClasses } from "./ui";

export function MobileMenu({
  isLoggedIn,
  displayName,
  unread,
}: {
  isLoggedIn: boolean;
  displayName: string;
  unread: number;
}) {
  const pathname = usePathname();
  // Le menu reste ouvert tant qu'on ne change pas de page.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (value: boolean) => setOpenedOn(value ? pathname : null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="relative flex size-10 items-center justify-center rounded-full text-stone-800 hover:bg-stone-900/5"
        aria-label="Ouvrir le menu"
        aria-expanded={open}
      >
        <Menu className="size-6" aria-hidden />
        {unread > 0 ? <span className="absolute right-1.5 top-1.5 size-2.5 rounded-full bg-brand-500" /> : null}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-stone-950/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col bg-cream shadow-2xl">
            <div className="flex h-16 items-center justify-between border-b border-stone-200 px-4">
              <span className="font-display text-lg font-semibold">
                {isLoggedIn ? `Bonjour ${displayName}` : "Menu"}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-10 items-center justify-center rounded-full hover:bg-stone-900/5"
                aria-label="Fermer le menu"
              >
                <X className="size-6" aria-hidden />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-3" aria-label="Navigation mobile">
              <Link href="/deposer" className={buttonClasses({ className: "mb-3 w-full" })}>
                <Plus className="size-4" aria-hidden />
                Déposer une annonce
              </Link>
              <MobileLink href="/annonces" icon={<Search className="size-5" />}>
                Toutes les annonces
              </MobileLink>
              <MobileLink href="/comment-ca-marche" icon={<BookOpen className="size-5" />}>
                Comment ça marche
              </MobileLink>
              <div className="my-3 h-px bg-stone-200" />
              {isLoggedIn ? (
                <>
                  <MobileLink href="/compte" icon={<LayoutList className="size-5" />}>
                    Mes annonces
                  </MobileLink>
                  <MobileLink href="/messages" icon={<MessageCircle className="size-5" />}>
                    Messages
                    {unread > 0 ? (
                      <span className="ml-auto rounded-full bg-brand-500 px-2 py-0.5 text-xs font-bold text-white">{unread}</span>
                    ) : null}
                  </MobileLink>
                  <MobileLink href="/compte/favoris" icon={<Heart className="size-5" />}>
                    Favoris
                  </MobileLink>
                  <MobileLink href="/compte/profil" icon={<UserRound className="size-5" />}>
                    Mon profil
                  </MobileLink>
                  <form action={signOut}>
                    <button
                      type="submit"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-medium text-stone-700 hover:bg-stone-900/5"
                    >
                      <LogOut className="size-5 text-stone-500" aria-hidden />
                      Se déconnecter
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <MobileLink href="/connexion" icon={<LogIn className="size-5" />}>
                    Se connecter
                  </MobileLink>
                  <MobileLink href="/inscription" icon={<UserRound className="size-5" />}>
                    Créer un compte
                  </MobileLink>
                </>
              )}
            </nav>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MobileLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl px-3 py-3 font-medium text-stone-800 hover:bg-stone-900/5">
      <span className="text-stone-500" aria-hidden>
        {icon}
      </span>
      {children}
    </Link>
  );
}
