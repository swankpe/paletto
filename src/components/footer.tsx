import Link from "next/link";
import { Leaf } from "lucide-react";
import { PALLET_TYPES, PALLET_TYPE_KEYS } from "@/lib/constants";
import { Logo } from "./logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-stone-200 bg-sand/60">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-600">
            La place de marché des palettes entre particuliers. Gratuit, local et sans commission.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-forest-100 px-3 py-1 text-xs font-semibold text-forest-800">
            <Leaf className="size-3.5" aria-hidden />
            Donnez une seconde vie au bois
          </p>
        </div>
        <FooterColumn title="Palettes">
          {PALLET_TYPE_KEYS.slice(0, 5).map((key) => (
            <FooterLink key={key} href={`/annonces?type=${key}`}>
              {PALLET_TYPES[key].short}
            </FooterLink>
          ))}
          <FooterLink href="/annonces?gratuit=1">Palettes gratuites</FooterLink>
        </FooterColumn>
        <FooterColumn title="Paletto">
          <FooterLink href="/comment-ca-marche">Comment ça marche</FooterLink>
          <FooterLink href="/comment-ca-marche#securite">Conseils de sécurité</FooterLink>
          <FooterLink href="/comment-ca-marche#faq">Questions fréquentes</FooterLink>
          <FooterLink href="/deposer">Déposer une annonce</FooterLink>
        </FooterColumn>
        <FooterColumn title="Informations">
          <FooterLink href="/cgu">Conditions d&apos;utilisation</FooterLink>
          <FooterLink href="/confidentialite">Confidentialité</FooterLink>
          <FooterLink href="/mentions-legales">Mentions légales</FooterLink>
        </FooterColumn>
      </div>
      <div className="border-t border-stone-200">
        <div className="container-page flex flex-col gap-2 py-6 text-sm text-stone-500 sm:flex-row sm:justify-between">
          <p>© {year} Paletto. Tous droits réservés.</p>
          <p>Fait en France avec du bois de récup 🪵</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-stone-900">{title}</h2>
      <ul className="mt-4 space-y-2.5">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-stone-600 hover:text-brand-700">
        {children}
      </Link>
    </li>
  );
}
