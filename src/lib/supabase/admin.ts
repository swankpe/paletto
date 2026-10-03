import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { SUPABASE_URL } from "./env";

/**
 * Client « administrateur » (clé secrète). Utilisé uniquement côté serveur,
 * et seulement si SUPABASE_SECRET_KEY est configurée.
 */
export function createAdminClient() {
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!SUPABASE_URL || !secretKey) return null;
  return createClient<Database>(SUPABASE_URL, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
