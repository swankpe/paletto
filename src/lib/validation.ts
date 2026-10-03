import { z } from "zod";
import { CONDITION_KEYS, LISTING_STATUS_KEYS, MAX_IMAGES, PALLET_TYPE_KEYS, REPORT_REASON_KEYS } from "./constants";

export const uuidSchema = z.uuid();

export function isUuid(value: unknown): value is string {
  return uuidSchema.safeParse(value).success;
}

const checkbox = z
  .union([z.literal("on"), z.literal("true"), z.literal(""), z.null(), z.undefined()])
  .transform((v) => v === "on" || v === "true");

export const listingSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(5, "Le titre doit contenir au moins 5 caractères.")
      .max(100, "Le titre ne doit pas dépasser 100 caractères."),
    description: z
      .string()
      .trim()
      .min(10, "Décrivez vos palettes en au moins 10 caractères.")
      .max(4000, "La description ne doit pas dépasser 4000 caractères."),
    pallet_type: z.enum(PALLET_TYPE_KEYS as [string, ...string[]], {
      message: "Choisissez un type de palette.",
    }),
    condition: z.enum(CONDITION_KEYS as [string, ...string[]], { message: "Choisissez un état." }),
    quantity: z.coerce
      .number({ message: "Indiquez une quantité." })
      .int("La quantité doit être un nombre entier.")
      .min(1, "La quantité minimale est de 1.")
      .max(100000, "Quantité trop élevée."),
    is_free: checkbox,
    price: z
      .string()
      .trim()
      .optional()
      .transform((v) => (v ?? "").replace(/\s/g, "").replace(",", ".")),
    price_negotiable: checkbox,
    delivery_possible: checkbox,
    postal_code: z
      .string()
      .trim()
      .regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres."),
    city: z
      .string()
      .trim()
      .min(1, "Indiquez la ville.")
      .max(80, "Nom de ville trop long."),
    images: z
      .string()
      .optional()
      .transform((v, ctx) => {
        if (!v) return [] as string[];
        try {
          const parsed = JSON.parse(v);
          if (!Array.isArray(parsed) || !parsed.every((p) => typeof p === "string")) throw new Error();
          return parsed as string[];
        } catch {
          ctx.addIssue({ code: "custom", message: "Photos invalides." });
          return z.NEVER;
        }
      })
      .pipe(z.array(z.string().max(300)).max(MAX_IMAGES, `${MAX_IMAGES} photos maximum.`)),
  })
  .transform((data, ctx) => {
    let priceCents = 0;
    if (!data.is_free) {
      const value = Number(data.price);
      if (!data.price || Number.isNaN(value)) {
        ctx.addIssue({ code: "custom", path: ["price"], message: "Indiquez un prix ou cochez « Gratuit »." });
        return z.NEVER;
      }
      if (value <= 0 || value > 100000) {
        ctx.addIssue({ code: "custom", path: ["price"], message: "Le prix doit être compris entre 0,01 € et 100 000 €." });
        return z.NEVER;
      }
      priceCents = Math.round(value * 100);
    }
    return {
      title: data.title,
      description: data.description,
      pallet_type: data.pallet_type,
      condition: data.condition,
      quantity: data.quantity,
      price_cents: priceCents,
      price_negotiable: data.is_free ? false : data.price_negotiable,
      delivery_possible: data.delivery_possible,
      postal_code: data.postal_code,
      city: data.city,
      images: data.images,
    };
  });

export type ListingInput = z.infer<typeof listingSchema>;

export const statusSchema = z.enum(LISTING_STATUS_KEYS as [string, ...string[]]);

export const messageSchema = z
  .string()
  .trim()
  .min(1, "Votre message est vide.")
  .max(2000, "Votre message ne doit pas dépasser 2000 caractères.");

export const reportSchema = z.object({
  reason: z.enum(REPORT_REASON_KEYS as [string, ...string[]], { message: "Choisissez un motif." }),
  details: z
    .string()
    .trim()
    .max(1000, "1000 caractères maximum.")
    .optional()
    .transform((v) => (v ? v : null)),
});

export const signUpSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(2, "Votre pseudo doit contenir au moins 2 caractères.")
    .max(40, "Votre pseudo ne doit pas dépasser 40 caractères."),
  email: z.string().trim().toLowerCase().pipe(z.email("Adresse e-mail invalide.")),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .max(72, "Le mot de passe ne doit pas dépasser 72 caractères."),
  accept_terms: z.literal("on", { message: "Vous devez accepter les conditions d'utilisation." }),
});

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Adresse e-mail invalide.")),
  password: z.string().min(1, "Saisissez votre mot de passe."),
});

export const profileSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(2, "Votre pseudo doit contenir au moins 2 caractères.")
    .max(40, "Votre pseudo ne doit pas dépasser 40 caractères."),
  city: z
    .string()
    .trim()
    .max(80, "Nom de ville trop long.")
    .optional()
    .transform((v) => (v ? v : null)),
  bio: z
    .string()
    .trim()
    .max(500, "500 caractères maximum.")
    .optional()
    .transform((v) => (v ? v : null)),
});

export function fieldErrorsFrom(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? "form";
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
