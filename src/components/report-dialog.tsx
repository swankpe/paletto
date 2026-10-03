"use client";

import { Flag } from "lucide-react";
import { useActionState, useState } from "react";
import { reportListing } from "@/lib/actions/listings";
import { initialFormState } from "@/lib/actions/types";
import { REPORT_REASONS, REPORT_REASON_KEYS } from "@/lib/constants";
import { SubmitButton } from "./submit-button";
import { Alert, FieldError, Label, Select, Textarea } from "./ui";

export function ReportDialog({ listingId, isLoggedIn }: { listingId: string; isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const [state, action] = useActionState(reportListing.bind(null, listingId), initialFormState);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-500 hover:text-red-600"
      >
        <Flag className="size-4" aria-hidden />
        Signaler cette annonce
      </button>
      {open ? (
        <div className="mt-3 rounded-2xl border border-stone-200 bg-white p-4">
          {!isLoggedIn ? (
            <p className="text-sm text-stone-600">
              <a href={`/connexion?next=/annonces/${listingId}`} className="font-semibold text-brand-700 underline">
                Connectez-vous
              </a>{" "}
              pour signaler une annonce.
            </p>
          ) : state.success ? (
            <Alert tone="success">{state.success}</Alert>
          ) : (
            <form action={action} className="space-y-3">
              {state.error ? <Alert tone="error">{state.error}</Alert> : null}
              <div>
                <Label htmlFor="report-reason">Motif</Label>
                <Select id="report-reason" name="reason" required defaultValue="">
                  <option value="" disabled>
                    Choisissez un motif
                  </option>
                  {REPORT_REASON_KEYS.map((key) => (
                    <option key={key} value={key}>
                      {REPORT_REASONS[key]}
                    </option>
                  ))}
                </Select>
                <FieldError message={state.fieldErrors?.reason} />
              </div>
              <div>
                <Label htmlFor="report-details">Précisions (facultatif)</Label>
                <Textarea id="report-details" name="details" maxLength={1000} rows={3} />
              </div>
              <SubmitButton variant="danger" size="sm" pendingLabel="Envoi…">
                Envoyer le signalement
              </SubmitButton>
            </form>
          )}
        </div>
      ) : null}
    </div>
  );
}
