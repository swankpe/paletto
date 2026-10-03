import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { safeNextPath } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

const OTP_TYPES: EmailOtpType[] = ["signup", "invite", "magiclink", "recovery", "email_change", "email"];

/**
 * Point d'arrivée des liens envoyés par e-mail (confirmation d'inscription,
 * réinitialisation du mot de passe…). Gère le format « token_hash » comme le format « code » (PKCE).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const code = searchParams.get("code");
  const next = safeNextPath(searchParams.get("next"), "/compte");

  const supabase = await createClient();

  if (tokenHash && type && OTP_TYPES.includes(type)) {
    const { error } = await supabase.auth.verifyOtp({ type, token_hash: tokenHash });
    if (!error) {
      const destination = type === "recovery" ? "/compte/nouveau-mot-de-passe" : next;
      return NextResponse.redirect(new URL(destination, origin));
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, origin));
  }

  // Lien d'inscription ouvert dans un autre navigateur : Supabase a déjà confirmé l'adresse
  // avant de rediriger avec le code, seule l'ouverture de session échoue.
  if (code && next !== "/compte/nouveau-mot-de-passe") {
    return NextResponse.redirect(new URL("/connexion?confirme=1", origin));
  }

  return NextResponse.redirect(new URL("/connexion?erreur=lien", origin));
}
