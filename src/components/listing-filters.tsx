"use client";

import { SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { CONDITIONS, CONDITION_KEYS, PALLET_TYPES, PALLET_TYPE_KEYS, SORT_OPTIONS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { DEPARTMENTS } from "@/lib/departments";
import { Checkbox, Input, Label, Select, buttonClasses } from "./ui";

export type FilterValues = {
  q?: string;
  type?: string;
  condition?: string;
  dept?: string;
  maxPrice?: number;
  free?: boolean;
  delivery?: boolean;
  sort: string;
};

export function ListingFilters({ values, activeCount }: { values: FilterValues; activeCount: number }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  function submit() {
    formRef.current?.requestSubmit();
  }

  return (
    <form
      ref={formRef}
      action="/annonces"
      method="get"
      className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-card sm:p-5"
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="q">
          Mots-clés
        </label>
        <Input
          id="q"
          name="q"
          type="search"
          defaultValue={values.q}
          placeholder="Rechercher : palette europe, bois, caisse…"
          className="flex-1"
        />
        <div className="flex gap-2">
          <button type="submit" className={buttonClasses({ className: "flex-1 sm:flex-none" })}>
            Rechercher
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className={buttonClasses({ variant: "outline", className: "lg:hidden" })}
            aria-expanded={mobileOpen}
            aria-controls="filtres-avances"
          >
            <SlidersHorizontal className="size-4" aria-hidden />
            Filtres{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
        </div>
      </div>

      <div
        id="filtres-avances"
        className={cn("mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 [&>*]:min-w-0", mobileOpen ? undefined : "max-lg:hidden")}
      >
        <div>
          <Label htmlFor="type">Type de palette</Label>
          <Select id="type" name="type" defaultValue={values.type ?? ""} onChange={submit}>
            <option value="">Tous les types</option>
            {PALLET_TYPE_KEYS.map((key) => (
              <option key={key} value={key}>
                {PALLET_TYPES[key].short}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="etat">État</Label>
          <Select id="etat" name="etat" defaultValue={values.condition ?? ""} onChange={submit}>
            <option value="">Tous les états</option>
            {CONDITION_KEYS.map((key) => (
              <option key={key} value={key}>
                {CONDITIONS[key].label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="dept">Département</Label>
          <Select id="dept" name="dept" defaultValue={values.dept ?? ""} onChange={submit}>
            <option value="">Toute la France</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.code} value={d.code}>
                {d.code} – {d.name}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="prixmax">Prix max / palette</Label>
          <div className="relative">
            <Input
              id="prixmax"
              name="prixmax"
              type="number"
              inputMode="decimal"
              min={1}
              step="any"
              defaultValue={values.maxPrice ?? ""}
              placeholder="Ex. 10"
              className="pr-9"
              disabled={values.free}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-stone-400">€</span>
          </div>
        </div>
        <div>
          <Label htmlFor="tri">Trier par</Label>
          <Select id="tri" name="tri" defaultValue={values.sort} onChange={submit}>
            {Object.entries(SORT_OPTIONS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:col-span-2 lg:col-span-5">
          <Checkbox name="gratuit" value="1" defaultChecked={values.free} onChange={submit} label="Palettes gratuites uniquement" />
          <Checkbox name="livraison" value="1" defaultChecked={values.delivery} onChange={submit} label="Livraison possible" />
          {activeCount > 0 ? (
            <Link href="/annonces" className="ml-auto inline-flex items-center gap-1 text-sm font-semibold text-stone-600 hover:text-brand-700">
              <X className="size-4" aria-hidden />
              Effacer les filtres
            </Link>
          ) : null}
        </div>
      </div>
    </form>
  );
}
