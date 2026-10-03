import { LISTING_IMAGES_BUCKET } from "./constants";
import { SUPABASE_URL } from "./supabase/env";

export function listingImageUrl(path: string | null | undefined) {
  if (!path) return null;
  return `${SUPABASE_URL}/storage/v1/object/public/${LISTING_IMAGES_BUCKET}/${path
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
}
