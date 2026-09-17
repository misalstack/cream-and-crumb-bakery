"use client";

import { useRef, useTransition } from "react";
import { Select } from "@/components/ui";

/**
 * A status dropdown that submits on change. Wrapped in a transition so the
 * pending state is visible and the select can't be changed mid-flight.
 */
export function StatusSelect({
  action,
  idName,
  idValue,
  current,
  options,
}: {
  /** Omitted in the static demo — a Server Action cannot be handed to a client
   *  component there, so the control renders read-only instead. */
  action?: (formData: FormData) => Promise<void>;
  idName: string;
  idValue: string;
  current: string;
  options: { value: string; label: string }[];
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  if (!action) {
    return (
      <Select
        aria-label="Status (read-only in this preview)"
        value={current}
        disabled
        onChange={() => {}}
        className="w-auto rounded-full py-2"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    );
  }

  return (
    <form ref={formRef} action={action}>
      <input type="hidden" name={idName} value={idValue} />
      <label className="sr-only" htmlFor={`status-${idValue}`}>
        Change status
      </label>
      <Select
        id={`status-${idValue}`}
        name="status"
        // Re-keyed on `current` so the control remounts when the server sends
        // back the new status. React resets the form after the action, which
        // otherwise snaps an uncontrolled select back to its original value —
        // leaving the dropdown disagreeing with the badge beside it.
        key={current}
        defaultValue={current}
        disabled={pending}
        onChange={() => {
          const form = formRef.current;
          if (form) startTransition(() => form.requestSubmit());
        }}
        className="w-auto rounded-full py-2"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </Select>
    </form>
  );
}
