"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import { useFormFields } from "@/components/forms/useFormFields";
import { Button, FieldError, Input, Label } from "@/components/ui";
import { EMPTY_STATE } from "@/lib/validation";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, EMPTY_STATE);
  // Controlled so a wrong password doesn't also clear the email field.
  const { field } = useFormFields({ email: "", password: "" });

  return (
    <form action={action} className="space-y-5" noValidate>
      {state.message && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-negative">
          {state.message}
        </p>
      )}

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" required autoComplete="email" {...field("email")} />
        <FieldError>{state.errors?.email}</FieldError>
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" required autoComplete="current-password" {...field("password")} />
        <FieldError>{state.errors?.password}</FieldError>
      </div>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
