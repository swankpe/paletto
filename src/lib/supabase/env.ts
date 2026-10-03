// Valeurs publiques du projet Supabase « Paletto ». La clé publishable est conçue pour
// être exposée au navigateur : la sécurité des données repose sur les règles RLS.
// Les variables d'environnement, si elles sont définies, restent prioritaires.
const DEFAULT_SUPABASE_URL = "https://nqpzxfbmcymyqvovpjqe.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_1IpgwcwtPmLZ_UVxnYQwWA_-pTceIzy";

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
export const SUPABASE_PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || DEFAULT_SUPABASE_PUBLISHABLE_KEY;

export function assertSupabaseEnv() {
  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    throw new Error(
      "Variables d'environnement Supabase manquantes : NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }
}
