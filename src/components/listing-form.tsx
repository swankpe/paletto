"use client";

import { useActionState, useCallback, useState } from "react";
import { initialFormState, type FormState } from "@/lib/actions/types";
import { CONDITIONS, CONDITION_KEYS, PALLET_TYPES, PALLET_TYPE_KEYS } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { CityFields } from "./city-fields";
import { ImageUploader } from "./image-uploader";
import { SubmitButton } from "./submit-button";
import { Alert, Card, Checkbox, FieldError, FieldHint, Input, Label, Select, Textarea } from "./ui";

export type ListingFormDefaults = {
  title: string;
  description: string;
  pallet_type: string;
  condition: string;
  quantity: string;
  price: string;
  is_free: boolean;
  price_negotiable: boolean;
  delivery_possible: boolean;
  postal_code: string;
  city: string;
};

export function ListingForm({
  action,
  defaults,
  userId,
  initialImages,
  submitLabel,
}: {
  action: (state: FormState, formData: FormData) => Promise<FormState>;
  defaults: ListingFormDefaults;
  userId: string;
  initialImages: { path: string; url: string }[];
  submitLabel: string;
}) {
  const [state, formAction] = useActionState(action, initialFormState);
  const [uploading, setUploading] = useState(false);
  const [isFree, setIsFree] = useState(defaults.is_free);
  const onUploadingChange = useCallback((value: boolean) => setUploading(value), []);

  const v = state.values;
  const errors = state.fieldErrors ?? {};
  const value = (key: keyof ListingFormDefaults) => (v && key in v ? v[key] : String(defaults[key] ?? ""));
  const checked = (key: "price_negotiable" | "delivery_possible") => (v ? v[key] === "on" : defaults[key]);

  return (
    <form action={formAction} className="space-y-6" noValidate>
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}

      <Card className="p-5 sm:p-7">
        <h2 className="text-xl font-bold">Vos palettes</h2>
        <div className="mt-5 space-y-5">
          <div>
            <Label htmlFor="title">Titre de l&apos;annonce</Label>
            <Input
              id="title"
              name="title"
              required
              minLength={5}
              maxLength={100}
              placeholder="Ex. : 20 palettes Europe EPAL en bon état"
              defaultValue={value("title")}
              invalid={Boolean(errors.title)}
            />
            <FieldError message={errors.title} />
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-stone-800">Type de palette</legend>
            <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {PALLET_TYPE_KEYS.map((key) => (
                <label
                  key={key}
                  className="relative flex cursor-pointer flex-col rounded-xl border border-stone-300 bg-white p-3.5 transition hover:border-brand-300 has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:checked]:ring-2 has-[:checked]:ring-brand-500/20"
                >
                  <input
                    type="radio"
                    name="pallet_type"
                    value={key}
                    required
                    defaultChecked={value("pallet_type") === key}
                    className="sr-only"
                  />
                  <span className="font-semibold text-stone-900">{PALLET_TYPES[key].short}</span>
                  <span className="text-sm text-stone-500">{PALLET_TYPES[key].dimensions}</span>
                </label>
              ))}
            </div>
            <FieldError message={errors.pallet_type} />
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="condition">État</Label>
              <Select
                id="condition"
                name="condition"
                required
                defaultValue={value("condition")}
                invalid={Boolean(errors.condition)}
              >
                <option value="" disabled>
                  Choisissez l&apos;état
                </option>
                {CONDITION_KEYS.map((key) => (
                  <option key={key} value={key}>
                    {CONDITIONS[key].label}
                  </option>
                ))}
              </Select>
              <FieldError message={errors.condition} />
            </div>
            <div>
              <Label htmlFor="quantity">Quantité disponible</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                inputMode="numeric"
                min={1}
                max={100000}
                step={1}
                required
                defaultValue={value("quantity")}
                invalid={Boolean(errors.quantity)}
              />
              <FieldError message={errors.quantity} />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              required
              minLength={10}
              maxLength={4000}
              rows={6}
              placeholder="État du bois, marquages (EPAL, NIMP15…), usage précédent, disponibilités pour le retrait, accès pour un véhicule…"
              defaultValue={value("description")}
              invalid={Boolean(errors.description)}
            />
            <FieldError message={errors.description} />
          </div>
        </div>
      </Card>

      <Card className="p-5 sm:p-7">
        <h2 className="text-xl font-bold">Photos</h2>
        <div className="mt-5">
          <ImageUploader userId={userId} initialImages={initialImages} onUploadingChange={onUploadingChange} />
          <FieldError message={errors.images} />
        </div>
      </Card>

      <Card className="p-5 sm:p-7">
        <h2 className="text-xl font-bold">Prix</h2>
        <div className="mt-5 space-y-4">
          <Checkbox
            name="is_free"
            checked={isFree}
            onChange={(e) => setIsFree(e.target.checked)}
            label="Je donne mes palettes gratuitement"
            hint="Idéal pour vider rapidement votre garage : les annonces gratuites partent très vite."
          />
          <div className={cn("grid gap-4 sm:grid-cols-[220px_1fr] sm:items-end", isFree && "opacity-50")}>
            <div>
              <Label htmlFor="price">Prix par palette</Label>
              <div className="relative">
                <Input
                  id="price"
                  name="price"
                  inputMode="decimal"
                  placeholder="Ex. 8"
                  disabled={isFree}
                  defaultValue={value("price")}
                  invalid={Boolean(errors.price)}
                  className="pr-10"
                />
                <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-stone-500">€</span>
              </div>
            </div>
            <Checkbox
              name="price_negotiable"
              defaultChecked={checked("price_negotiable")}
              disabled={isFree}
              label="Prix à débattre"
              className="pb-2.5"
            />
          </div>
          <FieldError message={errors.price} />
          {!isFree ? (
            <FieldHint>Repère : une palette Europe d&apos;occasion se vend généralement entre 3 et 12 € selon son état.</FieldHint>
          ) : null}
        </div>
      </Card>

      <Card className="p-5 sm:p-7">
        <h2 className="text-xl font-bold">Localisation et retrait</h2>
        <div className="mt-5 space-y-5">
          <CityFields
            defaultPostalCode={value("postal_code")}
            defaultCity={value("city")}
            errors={{ postal_code: errors.postal_code, city: errors.city }}
          />
          <FieldHint>Seuls la ville et le code postal sont affichés, jamais votre adresse.</FieldHint>
          <Checkbox
            name="delivery_possible"
            defaultChecked={checked("delivery_possible")}
            label="Je peux livrer (modalités à convenir avec l'acheteur)"
          />
        </div>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-500">
          En publiant, vous acceptez les{" "}
          <a href="/cgu" className="font-medium text-brand-700 underline" target="_blank">
            conditions d&apos;utilisation
          </a>
          .
        </p>
        <SubmitButton size="lg" pendingLabel="Enregistrement…" disabled={uploading}>
          {uploading ? "Envoi des photos…" : submitLabel}
        </SubmitButton>
      </div>
    </form>
  );
}
