"use client";

import { useEffect } from "react";
import { Button, Container } from "@/components/ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Swap for a real error reporter (Sentry et al.) before launch.
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-1 items-center bg-cream-50 py-24">
      <Container className="text-center">
        <h1 className="font-display text-5xl text-ink-900">Something went wrong</h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-ink-700">
          Sorry — that did not load. Try again, and if it keeps happening please call the bakery and we will
          take your order the old-fashioned way.
        </p>
        {error.digest && <p className="mt-3 text-xs text-ink-700">Reference: {error.digest}</p>}
        <div className="mt-9">
          <Button onClick={reset}>Try again</Button>
        </div>
      </Container>
    </main>
  );
}
