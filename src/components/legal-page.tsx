import type { ReactNode } from "react";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <div className="container-page max-w-3xl py-14">
      <h1 className="text-4xl font-extrabold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-stone-500">Dernière mise à jour : {updated}</p>
      <div className="prose-paletto mt-8">{children}</div>
    </div>
  );
}
