"use client";

import { useActionState } from "react";
import { submitContactMessage } from "@/app/(site)/actions";
import { useFormFields } from "@/components/forms/useFormFields";
import { Button, FieldError, Input, Label, Textarea } from "@/components/ui";
import { EMPTY_STATE } from "@/lib/validation";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContactMessage, EMPTY_STATE);
  // Controlled so a validation error doesn't wipe what was typed — React
  // resets the form once the Server Action resolves.
  const { field } = useFormFields({ name: "", email: "", phone: "", subject: "", message: "" });

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-emerald-600/25 bg-emerald-500/10 p-8 text-center">
        <p className="font-display text-2xl text-ink-900">Message sent</p>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-700">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.message && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-negative">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 ">
        <div>
          <Label htmlFor="contact-name">Your name</Label>
          <Input id="contact-name" required autoComplete="name" className="text-amber-100" {...field("name")} />
          <FieldError>{state.errors?.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="contact-email">Email</Label>
          <Input id="contact-email" type="email" required autoComplete="email" className="text-amber-100" {...field("email")} />
          <FieldError>{state.errors?.email}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="contact-phone">Phone (optional)</Label>
          <Input id="contact-phone" type="tel" autoComplete="tel" placeholder="0788 000 000" className="placeholder:text-[#8A8178] text-amber-100" {...field("phone")} />
          <FieldError>{state.errors?.phone}</FieldError>
        </div>
        <div>
          <Label htmlFor="contact-subject">Subject</Label>
          <Input id="contact-subject" required placeholder="Corporate order, feedback…" className="placeholder:text-[#8A8178] text-amber-100" {...field("subject")} />
          <FieldError>{state.errors?.subject}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" rows={6} required className="text-amber-100"{...field("message")} />
        <FieldError>{state.errors?.message}</FieldError>
      </div>

      <Button type="submit" disabled={pending} className="text-gold-600 dark:text-gold-400 hover:text-amber-50">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
