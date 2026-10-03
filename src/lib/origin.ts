import { headers } from "next/headers";

/**
 * Origine publique du site, utilisée pour les liens envoyés par e-mail.
 * NEXT_PUBLIC_SITE_URL (ou le domaine de production Vercel) est prioritaire pour ne jamais
 * dépendre d'un en-tête Host falsifiable.
 */
export async function getOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}
