"use client";

import { useState, type ChangeEvent } from "react";

type Fieldish = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

/**
 * Keeps form values in React state so they survive a Server Action round-trip.
 *
 * This is not a style preference. React resets a `<form action={…}>` after the
 * action resolves, including when the action comes back with validation
 * errors. With uncontrolled inputs that silently wipes everything the customer
 * typed — and worse, on the checkout form it reverted the pickup/delivery
 * radio to its default while the React state (and therefore the visible
 * address fields) still said DELIVERY, so re-submitting saved a delivery order
 * as a pickup with no address and no fee.
 */
export function useFormFields<T extends Record<string, string>>(initial: T) {
  const [values, setValues] = useState<T>(initial);

  function set<K extends keyof T & string>(name: K, value: T[K]) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  /** Spread onto an input/textarea/select: `<Input {...field("name")} />` */
  function field<K extends keyof T & string>(name: K) {
    return {
      name,
      value: values[name],
      onChange: (e: ChangeEvent<Fieldish>) => set(name, e.target.value as T[K]),
    };
  }

  return { values, set, field };
}
