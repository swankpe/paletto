"use client";

import { useEffect, useId, useState } from "react";
import { FieldError, Input, Label } from "./ui";

type Commune = { nom: string };

export function CityFields({
  defaultPostalCode,
  defaultCity,
  errors,
}: {
  defaultPostalCode: string;
  defaultCity: string;
  errors?: { postal_code?: string; city?: string };
}) {
  const [postalCode, setPostalCode] = useState(defaultPostalCode);
  const [city, setCity] = useState(defaultCity);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const listId = useId();

  useEffect(() => {
    if (!/^\d{5}$/.test(postalCode)) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    fetch(`https://geo.api.gouv.fr/communes?codePostal=${postalCode}&fields=nom&format=json`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((communes: Commune[]) => {
        const names = communes.map((c) => c.nom).sort((a, b) => a.localeCompare(b, "fr"));
        setSuggestions(names);
        setCity((current) => (names.length === 1 && !current ? names[0] : current));
      })
      .catch(() => setSuggestions([]));
    return () => controller.abort();
  }, [postalCode]);

  return (
    <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
      <div>
        <Label htmlFor="postal_code">Code postal</Label>
        <Input
          id="postal_code"
          name="postal_code"
          inputMode="numeric"
          autoComplete="postal-code"
          pattern="\d{5}"
          maxLength={5}
          required
          placeholder="69001"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
          invalid={Boolean(errors?.postal_code)}
        />
        <FieldError message={errors?.postal_code} />
      </div>
      <div>
        <Label htmlFor="city">Ville</Label>
        {suggestions.length > 1 ? (
          <select
            id="city"
            name="city"
            required
            value={suggestions.includes(city) ? city : ""}
            onChange={(e) => setCity(e.target.value)}
            className="block h-11 w-full rounded-xl border border-stone-300 bg-white px-3.5 text-[15px] shadow-sm focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15"
          >
            <option value="" disabled>
              Choisissez votre commune
            </option>
            {suggestions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        ) : (
          <>
            <Input
              id="city"
              name="city"
              required
              maxLength={80}
              autoComplete="address-level2"
              placeholder="Lyon"
              list={listId}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              invalid={Boolean(errors?.city)}
            />
            <datalist id={listId}>
              {suggestions.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
          </>
        )}
        <FieldError message={errors?.city} />
      </div>
    </div>
  );
}
