"use client";

import { useActionState } from "react";
import { submitCustomCakeRequest } from "@/app/(site)/actions";
import { useFormFields } from "@/components/forms/useFormFields";
import { Button, FieldError, Input, Label, Select, Textarea } from "@/components/ui";
import { EMPTY_STATE } from "@/lib/validation";
import { ALL_FLAVOURS } from "@/lib/cake-options";
import { whatsappLink } from "@/lib/bakery-info";

const OCCASIONS = [
  "Birthday",
  "Wedding",
  "Engagement / Dowry",
  "Graduation",
  "Baby shower",
  "Corporate / Office",
  "Anniversary",
  "Other",
];

export function CustomCakeForm() {
  const [state, action, pending] = useActionState(submitCustomCakeRequest, EMPTY_STATE);
  // Controlled so a validation error doesn't wipe what was typed — React
  // resets the form once the Server Action resolves.
  const { field } = useFormFields({
    name: "",
    phone: "",
    email: "",
    occasion: "",
    eventDate: "",
    servings: "",
    budgetRwf: "",
    flavour: "",
    description: "",
  });

  if (state.ok) {
    return (
      <div className="rounded-2xl border border-emerald-600/25 bg-emerald-500/10 p-8 text-center">
        <p className="font-display text-3xl text-ink-900">Request received</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-700">{state.message}</p>
        <a
          href={whatsappLink("Hello Sweet Crust! I just sent a custom cake request through your website.")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-wine-800 px-7 py-3.5 text-sm font-semibold text-paper-50 transition-colors hover:bg-wine-700"
        >
          Message us on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5 " noValidate>
      {state.message && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-negative">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2 ">
        <div>
          <Label htmlFor="cake-name">Your name</Label>
          <Input id="cake-name" required autoComplete="name" className="placeholder:text-[#8A8178] text-[#2c2420]"{...field("name")} />
          <FieldError>{state.errors?.name}</FieldError>
        </div>
        <div>
          <Label htmlFor="cake-phone">Phone / WhatsApp</Label>
          <Input id="cake-phone" type="tel" required autoComplete="tel" placeholder="0788 000 000" className="placeholder:text-[#8A8178] text-[#2c2420]" {...field("phone")} />
          <FieldError>{state.errors?.phone}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="cake-email">Email (optional)</Label>
        <Input id="cake-email" type="email" autoComplete="email" className="placeholder:text-[#8A8178] text-[#2c2420]" {...field("email")} />
        <FieldError>{state.errors?.email}</FieldError>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="cake-occasion">Occasion</Label>
          <Select id="cake-occasion" required className="placeholder:text-[#8A8178] text-[#2c2420]" {...field("occasion")}>
            <option value="" disabled>
              Choose an occasion
            </option>
            {OCCASIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </Select>
          <FieldError>{state.errors?.occasion}</FieldError>
        </div>
        <div>
          <Label htmlFor="cake-date">Date needed</Label>
          <Input id="cake-date" type="date" className="placeholder:text-[#8A8178] text-[#2c2420]"{...field("eventDate")} />
          <FieldError>{state.errors?.eventDate}</FieldError>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="cake-servings">Roughly how many people?</Label>
          <Input id="cake-servings" type="number" min={1} max={2000} placeholder="30" {...field("servings")} />
          <FieldError>{state.errors?.servings}</FieldError>
        </div>
        <div>
          <Label htmlFor="cake-budget">Budget in RWF (optional)</Label>
          <Input id="cake-budget" type="number" min={0} step={1000} placeholder="60000" className="placeholder:text-[#8A8178] text-[#2c2420]" {...field("budgetRwf")} />
          <FieldError>{state.errors?.budgetRwf}</FieldError>
        </div>
      </div>

      <div>
        <Label htmlFor="cake-flavour">Flavour ideas (optional)</Label>
        <Input
          id="cake-flavour"
          list="cake-flavour-options"
          placeholder="Red velvet, vanilla, chocolate fudge…" className="placeholder:text-[#8A8178] text-[#2c2420]"
          {...field("flavour")}
        />
        {/* Suggests the real flavour menu without blocking a request for
            something off-list. */}
        <datalist id="cake-flavour-options">
          {ALL_FLAVOURS.map((f) => (
            <option key={f} value={f} />
          ))}
        </datalist>
        <FieldError>{state.errors?.flavour}</FieldError>
      </div>

      <div>
        <Label htmlFor="cake-description">Tell us what you have in mind</Label>
        <Textarea
          id="cake-description"
          rows={6}
          required
          placeholder="Colours, theme, the message to pipe on top, whether you have a reference photo, dietary needs — anything at all."
          className="placeholder:text-[#8A8178] text-[#2c2420]"{...field("description")}
        />
        <FieldError>{state.errors?.description}</FieldError>
      </div>

      <p className="text-xs leading-relaxed text-ink-700">
        Have a reference photo? Send the form first, then WhatsApp us the picture — we will match it to your
        request.
      </p>

      <Button type="submit" disabled={pending}>
        {pending ? "Sending…" : "Send my request"}
      </Button>
    </form>
  );
}
