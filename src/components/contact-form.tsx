"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { contactSeller } from "@/lib/actions/messages";
import { initialFormState } from "@/lib/actions/types";
import { SubmitButton } from "./submit-button";
import { Alert, FieldError, Label, Textarea } from "./ui";

export function ContactForm({ listingId, listingTitle }: { listingId: string; listingTitle: string }) {
  const [state, action] = useActionState(contactSeller.bind(null, listingId), initialFormState);

  return (
    <form action={action} className="space-y-3">
      {state.error ? <Alert tone="error">{state.error}</Alert> : null}
      <div>
        <Label htmlFor="contact-body">Votre message au vendeur</Label>
        <Textarea
          id="contact-body"
          name="body"
          required
          maxLength={2000}
          rows={4}
          invalid={Boolean(state.fieldErrors?.body)}
          aria-describedby={state.fieldErrors?.body ? "contact-body-error" : undefined}
          defaultValue={
            state.values?.body ??
            `Bonjour, votre annonce « ${listingTitle} » est-elle toujours disponible ? Quand pourrais-je passer les récupérer ?`
          }
        />
        <FieldError id="contact-body-error" message={state.fieldErrors?.body} />
      </div>
      <SubmitButton className="w-full" pendingLabel="Envoi…">
        <Send className="size-4" aria-hidden />
        Envoyer le message
      </SubmitButton>
      <p className="text-center text-xs text-stone-500">Votre adresse e-mail n&apos;est jamais communiquée au vendeur.</p>
    </form>
  );
}
