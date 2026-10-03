"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, LayoutList, MessageCircle, UserRound } from "lucide-react";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/compte", label: "Mes annonces", icon: LayoutList },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/compte/favoris", label: "Favoris", icon: Heart },
  { href: "/compte/profil", label: "Profil", icon: UserRound },
];

export function AccountNav() {
  const pathname = usePathname();
  return (
    <nav className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" aria-label="Mon espace">
      <ul className="flex gap-2">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active = href === "/compte" ? pathname === "/compte" : pathname.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors",
                  active ? "bg-stone-900 text-white" : "bg-white text-stone-700 ring-1 ring-stone-200 hover:bg-stone-50",
                )}
              >
                <Icon className="size-4" aria-hidden />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
