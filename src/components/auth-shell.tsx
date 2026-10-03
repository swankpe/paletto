import Link from "next/link";
import type { ReactNode } from "react";
import { Leaf, MessageCircle, ShieldCheck } from "lucide-react";

export function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="container-page grid gap-10 py-12 lg:grid-cols-2 lg:py-20">
      <div className="mx-auto w-full max-w-md">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-2 text-stone-600">{subtitle}</p> : null}
        <div className="mt-8 rounded-2xl border border-stone-200/80 bg-white p-6 shadow-card sm:p-8">{children}</div>
        {footer ? <div className="mt-6 text-center text-sm text-stone-600">{footer}</div> : null}
      </div>
      <div className="wood-texture hidden rounded-3xl border border-stone-200/70 p-10 lg:flex lg:flex-col lg:justify-center">
        <p className="font-display text-3xl font-bold leading-tight text-stone-900">
          Des milliers de palettes attendent une seconde vie.
        </p>
        <ul className="mt-8 space-y-5 text-stone-700">
          <li className="flex gap-3">
            <ShieldCheck className="size-6 shrink-0 text-forest-600" aria-hidden />
            <span>Votre e-mail reste privé : les échanges passent par la messagerie Paletto.</span>
          </li>
          <li className="flex gap-3">
            <MessageCircle className="size-6 shrink-0 text-forest-600" aria-hidden />
            <span>Discutez directement avec les vendeurs et acheteurs de votre région.</span>
          </li>
          <li className="flex gap-3">
            <Leaf className="size-6 shrink-0 text-forest-600" aria-hidden />
            <span>Gratuit, sans commission, et bon pour la planète.</span>
          </li>
        </ul>
        <Link href="/annonces" className="mt-10 text-sm font-semibold text-brand-700 hover:text-brand-800">
          Parcourir les annonces sans compte →
        </Link>
      </div>
    </div>
  );
}
