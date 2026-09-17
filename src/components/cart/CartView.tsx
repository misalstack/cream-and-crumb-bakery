"use client";

import { useActionState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { placeOrder } from "@/app/(site)/cart/actions";
import { useCart } from "@/components/cart/CartProvider";
import { useFormFields } from "@/components/forms/useFormFields";
import { QuantityStepper } from "@/components/QuantityStepper";
import { Button, EmptyState, FieldError, Input, Label, LinkButton, Select, Textarea } from "@/components/ui";
import { cn } from "@/lib/cn";
import { formatPrice, type Currency } from "@/lib/currency";
import {
  DELIVERY_ZONES,
  FREE_DELIVERY_THRESHOLD_RWF,
  TIME_WINDOWS,
  deliveryFeeFor,
} from "@/lib/bakery-info";
import { EMPTY_STATE } from "@/lib/validation";

/** `YYYY-MM-DD` for `n` days from today, in the browser's local calendar. */
function dateInputValue(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function CartView({ currency }: { currency: Currency }) {
  const { items, hydrated, subtotalRwf, setQuantity, remove, clear } = useCart();
  const [state, action, pending] = useActionState(placeOrder, EMPTY_STATE);
  const router = useRouter();

  // Every field is controlled — React wipes an uncontrolled form after a
  // Server Action resolves, which loses the customer's typing on a validation error.
  const { values, set, field } = useFormFields({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    fulfillment: "PICKUP",
    deliveryZone: DELIVERY_ZONES[0].id,
    address: "",
    requestedDate: dateInputValue(1),
    timeWindow: TIME_WINDOWS[1] as string,
    notes: "",
  });
  const fulfillment = values.fulfillment as "PICKUP" | "DELIVERY";

  // On success the order lives in the database — drop the browser cart before navigating
  useEffect(() => {
    if (state.ok && state.redirectTo) {
      clear();
      router.push(state.redirectTo);
    }
  }, [state, clear, router]);

  if (!hydrated) {
    return <div className="h-64 animate-pulse rounded-2xl bg-cream-100" aria-hidden />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        body="Nothing in here yet. The croissants are still warm, if that helps."
        action={<LinkButton href="/patisseries">Browse the patisserie</LinkButton>}
      />
    );
  }

  const deliveryFeeRwf = fulfillment === "DELIVERY" ? deliveryFeeFor(values.deliveryZone, subtotalRwf) : 0;
  const totalRwf = subtotalRwf + deliveryFeeRwf;
  const qualifiesFree = subtotalRwf >= FREE_DELIVERY_THRESHOLD_RWF;
  const shortfall = FREE_DELIVERY_THRESHOLD_RWF - subtotalRwf;

  return (
    <div className="grid bg-transparent gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-14">
      {/* Line items (Left Side) ------------------------------------------------------ */}
      <div>
        <ul className="divide-y divide-ink-900/10">
          {items.map((item) => (
            <li key={item.key} className="flex gap-5 py-6 first:pt-0">
              <Link
                href={`/patisseries/${item.slug}`}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl"
              >
                <Image src={item.imageUrl} alt={item.name} fill sizes="96px" className="object-cover" />
              </Link>

              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="font-display text-xl leading-snug text-ink-900">
                      <Link href={`/patisseries/${item.slug}`} className="hover:text-accent">
                        {item.name}
                      </Link>
                    </h2>
                    {item.variantName && <p className="mt-0.5 text-sm text-ink-700">{item.variantName}</p>}
                    <p className="mt-1 text-sm text-ink-700">
                      {formatPrice(item.unitPriceRwf, currency)} each
                    </p>
                  </div>
                  <p className="whitespace-nowrap font-display text-lg font-semibold text-accent">
                    {formatPrice(item.unitPriceRwf * item.quantity, currency)}
                  </p>
                </div>

                <div className="mt-auto flex items-center gap-4 pt-4">
                  <QuantityStepper
                    size="sm"
                    value={item.quantity}
                    onChange={(next) => setQuantity(item.key, next)}
                    label={`Quantity for ${item.name}`}
                  />
                  <button
                    type="button"
                    onClick={() => remove(item.key)}
                    className="text-sm text-ink-700 underline underline-offset-4 hover:text-accent"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <LinkButton href="/patisseries" variant="outline">
            Keep shopping
          </LinkButton>
          <button
            type="button"
            onClick={clear}
            className="text-sm text-ink-700 underline underline-offset-4 hover:text-accent"
          >
            Empty cart
          </button>
        </div>
      </div>

      {/* Checkout (Right Side Form) -------------------------------------------------------- */}
      <form action={action} className="h-fit rounded-3xl border border-[#EADCD0] bg-[#F7EFE8] p-7 shadow-sm text-[#2A1810]">
        <input
          type="hidden"
          name="items"
          value={JSON.stringify(
            items.map((i) => ({ productId: i.productId, variantId: i.variantId, quantity: i.quantity })),
          )}
        />

        <h2 className="font-display text-3xl text-[#2A1810]">Checkout</h2>
        <p className="mt-1.5 text-sm text-[#6E5A4D]">
          We save your order and confirm it with you on WhatsApp — including how to pay. Nothing is charged here.
        </p>

        {state.message && !state.ok && (
          <p role="alert" className="mt-5 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-negative">
            {state.message}
          </p>
        )}

        <div className="mt-6 space-y-5">
          <div>
            <Label htmlFor="customerName">Your name</Label>
            <Input
              id="customerName"
              required
              autoComplete="name"
              className="bg-white border-[#D8C2B0] placeholder:text-[#8A8178] text-[#2c2420]"
              {...field("customerName")}
            />
            <FieldError>{state.errors?.customerName}</FieldError>
          </div>

          <div>
            <Label htmlFor="customerPhone">Phone / WhatsApp</Label>
            <Input
              id="customerPhone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="0788 000 000"
              className="bg-white border-[#D8C2B0] placeholder:text-[#8A8178] text-[#2c2420]"
              {...field("customerPhone")}
            />
            <FieldError>{state.errors?.customerPhone}</FieldError>
          </div>

          <div>
            <Label htmlFor="customerEmail">Email (optional)</Label>
            <Input
              id="customerEmail"
              type="email"
              autoComplete="email"
              className="bg-white border-[#D8C2B0] placeholder:text-[#8A8178] text-[#2c2420]"
              {...field("customerEmail")}
            />
            <FieldError>{state.errors?.customerEmail}</FieldError>
          </div>

          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-[#6E5A4D]">
              Pickup or delivery
            </legend>
            <input type="hidden" name="fulfillment" value={values.fulfillment} />
            <div role="radiogroup" aria-label="Pickup or delivery" className="grid grid-cols-2 gap-3">
              {(["PICKUP", "DELIVERY"] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  role="radio"
                  aria-checked={fulfillment === method}
                  onClick={() => set("fulfillment", method)}
                  className={cn(
                    "cursor-pointer rounded-xl border px-4 py-3 text-center text-sm font-medium transition-colors",
                    fulfillment === method
                      ? "border-accent bg-accent/10 text-accent font-semibold"
                      : "border-[#D8C2B0] text-[#6E5A4D] bg-white hover:border-accent/40",
                  )}
                >
                  {method === "PICKUP" ? "Pickup — free" : "Delivery"}
                </button>
              ))}
            </div>
            <FieldError>{state.errors?.fulfillment}</FieldError>
          </fieldset>

          {fulfillment === "DELIVERY" && (
            <>
              <div>
                <Label htmlFor="deliveryZone">Delivery zone</Label>
                <Select id="deliveryZone" className="bg-white border-[#D8C2B0] text-[#2c2420]" {...field("deliveryZone")}>
                  {DELIVERY_ZONES.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      {zone.name} — {formatPrice(zone.feeRwf, currency)} ({zone.areas})
                    </option>
                  ))}
                </Select>
                <FieldError>{state.errors?.deliveryZone}</FieldError>
              </div>

              <div>
                <Label htmlFor="address">Delivery address</Label>
                <Textarea
                  id="address"
                  rows={3}
                  required
                  placeholder="House / building, street, district, and a landmark if it helps our rider."
                  className="bg-white border-[#D8C2B0] placeholder:text-[#8A8178] text-[#2c2420]"
                  {...field("address")}
                />
                <FieldError>{state.errors?.address}</FieldError>
              </div>
            </>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="requestedDate">
                {fulfillment === "DELIVERY" ? "Delivery date" : "Pickup date"}
              </Label>
              <Input
                id="requestedDate"
                type="date"
                className="bg-white border-[#D8C2B0] text-[#2c2420]"
                required
                min={dateInputValue(0)}
                {...field("requestedDate")}
              />
              <FieldError>{state.errors?.requestedDate}</FieldError>
            </div>
            <div>
              <Label htmlFor="timeWindow">Time window</Label>
              <Select id="timeWindow" className="bg-white border-[#D8C2B0] text-[#2c2420]" {...field("timeWindow")}>
                {TIME_WINDOWS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </Select>
              <FieldError>{state.errors?.timeWindow}</FieldError>
            </div>
          </div>

          <div>
            <Label htmlFor="notes" >Anything we should know? (optional)</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder="A message to pipe on the cake, an allergy, gate code…"
              className="bg-white border-[#D8C2B0] placeholder:text-[#8A8178] text-[#2c2420]"
              {...field("notes")}
            />
            <FieldError>{state.errors?.notes}</FieldError>
          </div>
        </div>

        {/* Totals -------------------------------------------------------- */}
        <dl className="mt-7 space-y-2.5 border-t border-[#D8C2B0] pt-6 text-sm">
          <div className="flex justify-between">
            <dt className="text-[#6E5A4D]">Subtotal</dt>
            <dd className="font-medium text-[#2A1810]">{formatPrice(subtotalRwf, currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[#6E5A4D]">{fulfillment === "DELIVERY" ? "Delivery" : "Pickup"}</dt>
            <dd className="font-medium text-[#2A1810]">
              {deliveryFeeRwf === 0 ? "Free" : formatPrice(deliveryFeeRwf, currency)}
            </dd>
          </div>
          <div className="flex justify-between border-t border-[#D8C2B0] pt-3 text-base">
            <dt className="font-semibold text-[#2A1810]">Total</dt>
            <dd className="font-display text-2xl font-semibold text-accent">
              {formatPrice(totalRwf, currency)}
            </dd>
          </div>
        </dl>

        {fulfillment === "DELIVERY" && !qualifiesFree && (
          <p className="mt-4 rounded-lg bg-[#EADCD0]/50 px-4 py-3 text-xs text-accent">
            Add {formatPrice(shortfall, currency)} more and delivery is on us.
          </p>
        )}

        <Button type="submit" disabled={pending} className="mt-6 w-full">
          {pending ? "Placing order…" : "Place order"}
        </Button>

        <p className="mt-3 text-center text-xs leading-relaxed text-[#6E5A4D]">
          By placing this order you agree we may contact you on the number above to confirm it.
        </p>
      </form>
    </div>
  );
}