"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { requestPasswordReset, signIn, signUp, updatePassword } from "@/lib/actions/auth";
import { initialFormState } from "@/lib/actions/types";
import { SubmitButton } from "./submit-button";
import { Alert, Checkbox, FieldError, Input, Label } from "./ui";

function PasswordInput({
  id,
  name,
  autoComplete,
  invalid,
  minLength,
}: {
  id: string;
  name: string;
  autoComplete: string;
  invalid?: boolean;
  minLength?: number;
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        name={name}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        required
        minLength={minLength}
        maxLength={72}
        invalid={invalid}
        className="pr-12"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 right-1 flex w-10 items-center justify-center text-stone-500 hover:text-stone-800"
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
      >
        {visible ? <EyeOff className="size-5" aria-hidden /> : <Eye className="size-5" aria-hidden />}
      </button>
    </div>
  );
}

export function SignInForm({ next, initialError }: { next: string; initialError?: string }) {
  const [state, action] = useActionState(signIn, initialFormState);
  const error = state.error ?? (state === initialFormState ? initialError : undefined);
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {error ? <Alert tone="error">{error}</Alert> : null}
      <div>
        <Label htmlFor="email">Adresse e-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          invalid={Boolean(state.fieldErrors?.email)}
        />
        <FieldError message={state.fieldErrors?.email} />
      </div>
      <div>
        <div className="flex items-baseline justify-between">
          <Label htmlFor="password">Mot de passe</Label>
          <Link href="/mot-de-passe-oublie" className="text-sm font-medium text-brand-700 hover:text-brand-800">
            Mot de passe oublié ?
          </Link>
        </div>
        <PasswordInput id="password" name="password" autoComplete="current-password" invalid={Boolean(state.fieldErrors?.password)} />
        <FieldError message={state.fieldErrors?.password} />
      </div>
      <SubmitButton className="w-full" size="lg" pendingLabel="Connexion…">
        Se connecter
      </SubmitButton>
    </form>
  );
}

export function SignUpForm({ next }: { next: string }) {
  const [state, action] = useActionState(signUp, initialFormState);

  if (state.success) {
    return (
      <Alert tone="success">
        <p className="font-semibold">Vérifiez votre boîte mail ✉️</p>
        <p className="mt-1">{state.success}</p>
        <p className="mt-2 text-xs">Pensez à regarder dans vos courriers indésirables.</p>
      </Alert>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      <div>
        <Label htmlFor="display_name">Pseudo</Label>
        <Input
          id="display_name"
          name="display_name"
          autoComplete="nickname"
          required
          minLength={2}
          maxLength={40}
          placeholder="Ex. : Julie de Nantes"
          defaultValue={state.values?.display_name}
          invalid={Boolean(state.fieldErrors?.display_name)}
        />
        <FieldError message={state.fieldErrors?.display_name} />
      </div>
      <div>
        <Label htmlFor="email">Adresse e-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          invalid={Boolean(state.fieldErrors?.email)}
        />
        <FieldError message={state.fieldErrors?.email} />
      </div>
      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          minLength={8}
          invalid={Boolean(state.fieldErrors?.password)}
        />
        <FieldError message={state.fieldErrors?.password ?? undefined} />
        {!state.fieldErrors?.password ? <p className="mt-1.5 text-sm text-stone-500">8 caractères minimum.</p> : null}
      </div>
      <Checkbox
        name="accept_terms"
        required
        label={
          <>
            J&apos;accepte les{" "}
            <Link href="/cgu" className="font-medium text-brand-700 underline" target="_blank">
              conditions d&apos;utilisation
            </Link>{" "}
            et la{" "}
            <Link href="/confidentialite" className="font-medium text-brand-700 underline" target="_blank">
              politique de confidentialité
            </Link>
            .
          </>
        }
      />
      <FieldError message={state.fieldErrors?.accept_terms} />
      <SubmitButton className="w-full" size="lg" pendingLabel="Création du compte…">
        Créer mon compte
      </SubmitButton>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [state, action] = useActionState(requestPasswordReset, initialFormState);
  if (state.success) return <Alert tone="success">{state.success}</Alert>;
  return (
    <form action={action} className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      <div>
        <Label htmlFor="email">Adresse e-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          defaultValue={state.values?.email}
          invalid={Boolean(state.fieldErrors?.email)}
        />
        <FieldError message={state.fieldErrors?.email} />
      </div>
      <SubmitButton className="w-full" size="lg" pendingLabel="Envoi…">
        Recevoir le lien
      </SubmitButton>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action] = useActionState(updatePassword, initialFormState);
  return (
    <form action={action} className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      <div>
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          minLength={8}
          invalid={Boolean(state.fieldErrors?.password)}
        />
        <FieldError message={state.fieldErrors?.password} />
      </div>
      <div>
        <Label htmlFor="confirm">Confirmez le mot de passe</Label>
        <PasswordInput
          id="confirm"
          name="confirm"
          autoComplete="new-password"
          minLength={8}
          invalid={Boolean(state.fieldErrors?.confirm)}
        />
        <FieldError message={state.fieldErrors?.confirm} />
      </div>
      <SubmitButton className="w-full" size="lg" pendingLabel="Enregistrement…">
        Enregistrer le mot de passe
      </SubmitButton>
    </form>
  );
}
