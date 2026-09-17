"use client";

import { cn } from "@/lib/cn";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantity",
  size = "md",
}: {
  value: number;
  /**
   * Accepts a React-style updater. The buttons deliberately send a function
   * rather than `value ± 1`: React batches clicks within a frame, so deriving
   * from the captured `value` prop silently drops every increment after the
   * first when someone taps + quickly.
   */
  onChange: (next: number | ((prev: number) => number)) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: "sm" | "md";
}) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  const btn =
    size === "sm"
      ? "h-8 w-8 text-base"
      : "h-11 w-11 text-lg";

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border border-ink-900/15 bg-surface",
        size === "sm" && "text-sm",
      )}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange((prev) => clamp(prev - 1))}
        disabled={value <= min}
        className={cn(
          btn,
          "flex items-center justify-center rounded-full transition-colors hover:bg-ink-900/5 disabled:opacity-30 disabled:hover:bg-transparent",
        )}
      >
        −
      </button>
      <span
        aria-live="polite"
        className={cn("min-w-8 text-center font-semibold tabular-nums text-[#2c2420]", size === "sm" && "min-w-6")}
      >
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange((prev) => clamp(prev + 1))}
        disabled={value >= max}
        className={cn(
          btn,
          "flex items-center justify-center rounded-full transition-colors hover:bg-ink-900/5 disabled:opacity-30 disabled:hover:bg-transparent",
        )}
      >
        +
      </button>
    </div>
  );
}
