"use client";

import { useActionState } from "react";
import { deleteAccount, updateProfile } from "@/lib/actions/profile";
import { initialFormState } from "@/lib/actions/types";
import { SubmitButton } from "./submit-button";
import { Alert, FieldError, FieldHint, Input, Label, Textarea } from "./ui";

export function ProfileForm({
  defaults,
}: {
  defaults: { display_name: string; city: string; bio: string };
}) {
  const [state, action] = useActionState(updateProfile, initialFormState);
  const v = state.values;
  return (
    <form action={action} className="space-y-5">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}
      <div>
        <Label htmlFor="display_name">Pseudo</Label>
        <Input
          id="display_name"
          name="display_name"
          required
          minLength={2}
          maxLength={40}
          defaultValue={v?.display_name ?? defaults.display_name}
          invalid={Boolean(state.fieldErrors?.display_name)}
        />
        <FieldError message={state.fieldErrors?.display_name} />
        <FieldHint>Affiché sur vos annonces et dans la messagerie.</FieldHint>
      </div>
      <div>
        <Label htmlFor="city">Ville (facultatif)</Label>
        <Input id="city" name="city" maxLength={80} defaultValue={v?.city ?? defaults.city} invalid={Boolean(state.fieldErrors?.city)} />
        <FieldError message={state.fieldErrors?.city} />
      </div>
      <div>
        <Label htmlFor="bio">À propos de vous (facultatif)</Label>
        <Textarea
          id="bio"
          name="bio"
          maxLength={500}
          rows={4}
          placeholder="Ex. : Menuisier amateur, je récupère et revends régulièrement des palettes."
          defaultValue={v?.bio ?? defaults.bio}
          invalid={Boolean(state.fieldErrors?.bio)}
        />
        <FieldError message={state.fieldErrors?.bio} />
      </div>
      <SubmitButton pendingLabel="Enregistrement…">Enregistrer</SubmitButton>
    </form>
  );
}

export function DeleteAccountForm() {
  const [state, action] = useActionState(deleteAccount, initialFormState);
  return (
    <form action={action} className="space-y-4">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      <div>
        <Label htmlFor="confirm">
          Tapez <span className="font-mono">SUPPRIMER</span> pour confirmer
        </Label>
        <Input id="confirm" name="confirm" autoComplete="off" invalid={Boolean(state.fieldErrors?.confirm)} />
        <FieldError message={state.fieldErrors?.confirm} />
      </div>
      <SubmitButton variant="danger" pendingLabel="Suppression…">
        Supprimer définitivement mon compte
      </SubmitButton>
    </form>
  );
}
