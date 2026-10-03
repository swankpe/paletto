import type { MetadataRoute } from "next";
import { PALLET_TYPE_KEYS } from "@/lib/constants";
import { absoluteUrl } from "@/lib/site";
import { createAnonClient } from "@/lib/supabase/anon";

export const revalidate = 3600;

async function getSitemapListings() {
  const { data } = await createAnonClient()
    .from("listings")
    .select("id, updated_at")
    .in("status", ["active", "reserved"])
    .order("updated_at", { ascending: false })
    .limit(5000);
  return data ?? [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await getSitemapListings().catch(() => []);
  const now = new Date();

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/annonces"), lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    ...PALLET_TYPE_KEYS.map((type) => ({
      url: absoluteUrl(`/annonces?type=${type}`),
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    { url: absoluteUrl("/comment-ca-marche"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/inscription"), changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/cgu"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/confidentialite"), changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/mentions-legales"), changeFrequency: "yearly", priority: 0.2 },
    ...listings.map((listing) => ({
      url: absoluteUrl(`/annonces/${listing.id}`),
      lastModified: new Date(listing.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
