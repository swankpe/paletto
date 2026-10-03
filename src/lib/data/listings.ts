import { cache } from "react";
import {
  CONDITION_KEYS,
  PAGE_SIZE,
  PALLET_TYPE_KEYS,
  SORT_OPTIONS,
  type Condition,
  type PalletType,
  type SortOption,
} from "../constants";
import { DEPARTMENTS } from "../departments";
import { createClient } from "../supabase/server";
import { isUuid } from "../validation";

export const LISTING_CARD_COLUMNS =
  "id, title, pallet_type, condition, quantity, price_cents, price_negotiable, delivery_possible, city, postal_code, images, status, created_at";

export type ListingCardData = {
  id: string;
  title: string;
  pallet_type: string;
  condition: string;
  quantity: number;
  price_cents: number;
  price_negotiable: boolean;
  delivery_possible: boolean;
  city: string;
  postal_code: string;
  images: string[];
  status: string;
  created_at: string;
};

export type ListingFilters = {
  q?: string;
  type?: PalletType;
  condition?: Condition;
  dept?: string;
  maxPrice?: number;
  free?: boolean;
  delivery?: boolean;
  sort: SortOption;
  page: number;
};

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function parseFilters(searchParams: RawSearchParams): ListingFilters {
  const q = first(searchParams.q)?.trim().slice(0, 100) || undefined;
  const type = first(searchParams.type);
  const condition = first(searchParams.etat);
  const dept = first(searchParams.dept);
  const maxPriceRaw = Number(first(searchParams.prixmax));
  const sort = first(searchParams.tri);
  const page = Number.parseInt(first(searchParams.page) ?? "1", 10);

  return {
    q,
    type: PALLET_TYPE_KEYS.includes(type as PalletType) ? (type as PalletType) : undefined,
    condition: CONDITION_KEYS.includes(condition as Condition) ? (condition as Condition) : undefined,
    dept: DEPARTMENTS.some((d) => d.code === dept) ? dept : undefined,
    maxPrice: Number.isFinite(maxPriceRaw) && maxPriceRaw > 0 ? Math.min(maxPriceRaw, 100000) : undefined,
    free: first(searchParams.gratuit) === "1",
    delivery: first(searchParams.livraison) === "1",
    sort: sort && sort in SORT_OPTIONS ? (sort as SortOption) : "recent",
    page: Number.isFinite(page) && page > 0 ? Math.min(page, 500) : 1,
  };
}

export function filtersToSearchParams(filters: Partial<ListingFilters>) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.type) params.set("type", filters.type);
  if (filters.condition) params.set("etat", filters.condition);
  if (filters.dept) params.set("dept", filters.dept);
  if (filters.maxPrice) params.set("prixmax", String(filters.maxPrice));
  if (filters.free) params.set("gratuit", "1");
  if (filters.delivery) params.set("livraison", "1");
  if (filters.sort && filters.sort !== "recent") params.set("tri", filters.sort);
  if (filters.page && filters.page > 1) params.set("page", String(filters.page));
  return params;
}

export async function searchListings(filters: ListingFilters) {
  const supabase = await createClient();
  const from = (filters.page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("listings")
    .select(LISTING_CARD_COLUMNS, { count: "exact" })
    .in("status", ["active", "reserved"]);

  if (filters.q) query = query.textSearch("search", filters.q, { type: "websearch", config: "french" });
  if (filters.type) query = query.eq("pallet_type", filters.type);
  if (filters.condition) query = query.eq("condition", filters.condition);
  if (filters.dept) query = query.eq("department", filters.dept);
  if (filters.free) query = query.eq("price_cents", 0);
  else if (filters.maxPrice) query = query.lte("price_cents", Math.round(filters.maxPrice * 100));
  if (filters.delivery) query = query.eq("delivery_possible", true);

  switch (filters.sort) {
    case "prix_asc":
      query = query.order("price_cents", { ascending: true }).order("created_at", { ascending: false });
      break;
    case "prix_desc":
      query = query.order("price_cents", { ascending: false }).order("created_at", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, count, error } = await query.range(from, to);
  if (error) {
    // Une plage hors limites (page trop grande) renvoie une erreur PGRST103 : on renvoie une page vide.
    if (error.code === "PGRST103") return { listings: [] as ListingCardData[], count: count ?? 0 };
    throw new Error(`Impossible de charger les annonces : ${error.message}`);
  }
  return { listings: (data ?? []) as ListingCardData[], count: count ?? 0 };
}

export async function getLatestListings(limit = 8) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(LISTING_CARD_COLUMNS)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw new Error(`Impossible de charger les annonces : ${error.message}`);
  return (data ?? []) as ListingCardData[];
}

export async function getMarketplaceStats() {
  const supabase = await createClient();
  const [{ count: listings }, { data: quantities }] = await Promise.all([
    supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("listings").select("quantity").eq("status", "active").limit(1000),
  ]);
  const pallets = (quantities ?? []).reduce((sum, row) => sum + row.quantity, 0);
  return { listings: listings ?? 0, pallets };
}

export const getListing = cache(async (id: string) => {
  if (!isUuid(id)) return null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(
      "id, seller_id, title, description, pallet_type, condition, quantity, price_cents, price_negotiable, delivery_possible, postal_code, city, department, images, status, views, created_at, updated_at, seller:profiles!listings_seller_id_fkey(id, display_name, city, created_at)",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Impossible de charger l'annonce : ${error.message}`);
  return data;
});

export type ListingDetail = NonNullable<Awaited<ReturnType<typeof getListing>>>;

export async function getSimilarListings(listing: { id: string; pallet_type: string; department: string | null }) {
  const supabase = await createClient();
  let query = supabase
    .from("listings")
    .select(LISTING_CARD_COLUMNS)
    .eq("status", "active")
    .eq("pallet_type", listing.pallet_type)
    .neq("id", listing.id)
    .order("created_at", { ascending: false })
    .limit(4);
  if (listing.department) query = query.eq("department", listing.department);
  const { data } = await query;
  if (data && data.length > 0) return data as ListingCardData[];

  const { data: fallback } = await supabase
    .from("listings")
    .select(LISTING_CARD_COLUMNS)
    .eq("status", "active")
    .eq("pallet_type", listing.pallet_type)
    .neq("id", listing.id)
    .order("created_at", { ascending: false })
    .limit(4);
  return (fallback ?? []) as ListingCardData[];
}

export async function getSellerProfile(id: string) {
  if (!isUuid(id)) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, city, bio, created_at")
    .eq("id", id)
    .maybeSingle();
  return data;
}

export async function getSellerListings(sellerId: string, { includeSold = false } = {}) {
  const supabase = await createClient();
  let query = supabase
    .from("listings")
    .select(LISTING_CARD_COLUMNS)
    .eq("seller_id", sellerId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (!includeSold) query = query.in("status", ["active", "reserved"]);
  const { data, error } = await query;
  if (error) throw new Error(`Impossible de charger les annonces : ${error.message}`);
  return (data ?? []) as ListingCardData[];
}

export async function countSellerListings(sellerId: string) {
  const supabase = await createClient();
  const [{ count: active }, { count: sold }] = await Promise.all([
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("seller_id", sellerId)
      .in("status", ["active", "reserved"]),
    supabase
      .from("listings")
      .select("id", { count: "exact", head: true })
      .eq("seller_id", sellerId)
      .eq("status", "sold"),
  ]);
  return { active: active ?? 0, sold: sold ?? 0 };
}

export async function getMyListings(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("listings")
    .select(`${LISTING_CARD_COLUMNS}, views, updated_at`)
    .eq("seller_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Impossible de charger vos annonces : ${error.message}`);
  return data ?? [];
}

export async function getFavoriteIds(userId: string | undefined) {
  if (!userId) return new Set<string>();
  const supabase = await createClient();
  const { data } = await supabase.from("favorites").select("listing_id").eq("user_id", userId);
  return new Set((data ?? []).map((row) => row.listing_id));
}

export async function getFavoriteListings(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("favorites")
    .select(`created_at, listing:listings!favorites_listing_id_fkey(${LISTING_CARD_COLUMNS})`)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw new Error(`Impossible de charger vos favoris : ${error.message}`);
  return (data ?? [])
    .map((row) => row.listing as unknown as ListingCardData | null)
    .filter((listing): listing is ListingCardData => Boolean(listing));
}
