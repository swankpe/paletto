"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { safeNextPath } from "../auth";
import { getOrigin } from "../origin";
import { createClient } from "../supabase/server";
import { fieldErrorsFrom, signInSchema, signUpSchema } from "../validation";
import { formValues, type FormState } from "./types";

export async function signIn(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = formValues(formData, ["email"]);
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), values };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        error: "Votre adresse e-mail n'est pas encore confirmée. Cliquez sur le lien reçu par e-mail pour activer votre compte.",
        values,
      };
    }
    if (error.status === 429) {
      return { error: "Trop de tentatives. Patientez quelques minutes avant de réessayer.", values };
    }
    return { error: "E-mail ou mot de passe incorrect.", values };
  }

  revalidatePath("/", "layout");
  redirect(safeNextPath(formData.get("next")));
}

export async function signUp(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = formValues(formData, ["display_name", "email"]);
  const parsed = signUpSchema.safeParse({
    display_name: formData.get("display_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    accept_terms: formData.get("accept_terms"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error), values };

  const next = safeNextPath(formData.get("next"), "/compte");
  const origin = await getOrigin();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { display_name: parsed.data.display_name },
      emailRedirectTo: `${origin}/auth/confirm?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    if (error.code === "user_already_exists" || error.code === "email_exists") {
      return { error: "Un compte existe déjà avec cette adresse e-mail. Connectez-vous.", values };
    }
    if (error.code === "weak_password") {
      return { fieldErrors: { password: "Mot de passe trop faible : mélangez lettres, chiffres et symboles." }, values };
    }
    if (error.status === 429 || error.code === "over_email_send_rate_limit") {
      return { error: "Trop d'inscriptions en peu de temps. Réessayez dans quelques minutes.", values };
    }
    if (error.code === "email_address_not_authorized" || error.code === "unexpected_failure") {
      console.error("[inscription] envoi de l'e-mail de confirmation impossible :", error.code, error.message);
      return {
        error: "Les inscriptions sont momentanément indisponibles (envoi d'e-mail impossible). Réessayez plus tard.",
        values,
      };
    }
    console.error("[inscription] échec :", error.code, error.message);
    return { error: "L'inscription a échoué. Vérifiez vos informations et réessayez.", values };
  }

  // Adresse déjà utilisée (Supabase renvoie un utilisateur sans identité pour ne rien divulguer).
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { error: "Un compte existe déjà avec cette adresse e-mail. Connectez-vous.", values };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect(next === "/compte" ? "/compte?bienvenue=1" : next);
  }

  return {
    success: `Presque fini ! Nous avons envoyé un lien de confirmation à ${parsed.data.email}. Cliquez dessus pour activer votre compte.`,
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function requestPasswordReset(_prev: FormState, formData: FormData): Promise<FormState> {
  const values = formValues(formData, ["email"]);
  const parsed = z.email("Adresse e-mail invalide.").safeParse(String(formData.get("email") ?? "").trim().toLowerCase());
  if (!parsed.success) return { fieldErrors: { email: "Adresse e-mail invalide." }, values };

  const origin = await getOrigin();
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${origin}/auth/confirm?next=${encodeURIComponent("/compte/nouveau-mot-de-passe")}`,
  });
  if (error?.status === 429) {
    return { error: "Trop de demandes. Patientez quelques minutes avant de réessayer.", values };
  }

  return {
    success:
      "Si un compte existe avec cette adresse, vous allez recevoir un e-mail contenant un lien pour choisir un nouveau mot de passe.",
  };
}

export async function updatePassword(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) return { fieldErrors: { password: "8 caractères minimum." } };
  if (password.length > 72) return { fieldErrors: { password: "72 caractères maximum." } };
  if (password !== confirm) return { fieldErrors: { confirm: "Les deux mots de passe ne correspondent pas." } };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Votre lien a expiré. Recommencez la procédure de réinitialisation." };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    if (error.code === "same_password") {
      return { fieldErrors: { password: "Choisissez un mot de passe différent de l'ancien." } };
    }
    if (error.code === "weak_password") {
      return { fieldErrors: { password: "Mot de passe trop faible." } };
    }
    return { error: "La mise à jour a échoué. Réessayez." };
  }

  revalidatePath("/", "layout");
  redirect("/compte?mdp=1");
}
