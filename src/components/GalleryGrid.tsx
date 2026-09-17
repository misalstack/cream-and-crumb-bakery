"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { cn } from "@/lib/cn";

export type GalleryItem = { id: string; imageUrl: string; caption: string; tag: string };

const TAG_LABELS: Record<string, string> = {
  bakery: "The bakery",
  cakes: "Cakes",
  pastries: "Pastries",
};

export function GalleryGrid({ images }: { images: GalleryItem[] }) {
  const [tag, setTag] = useState<string | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const visible = tag ? images.filter((i) => i.tag === tag) : images;
  const tags = [...new Set(images.map((i) => i.tag))];

  const close = useCallback(() => setOpenIndex(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpenIndex((current) =>
        current === null ? null : (current + delta + visible.length) % visible.length,
      ),
    [visible.length],
  );

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [openIndex, close, step]);

  const active = openIndex === null ? null : visible[openIndex];

  return (
    <>
      <div className="flex flex-wrap gap-2.5">
        <FilterPill active={tag === null} onClick={() => setTag(null)}>
          Everything
        </FilterPill>
        {tags.map((t) => (
          <FilterPill key={t} active={tag === t} onClick={() => setTag(t)}>
            {TAG_LABELS[t] ?? t}
          </FilterPill>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            aria-label={`Open image: ${image.caption}`}
            className={cn(
              "group relative overflow-hidden rounded-2xl",
              // A gentle rhythm so the grid doesn't read as a spreadsheet.
              index % 5 === 0 ? "aspect-4/5 lg:row-span-2" : "aspect-4/3",
            )}
          >
            <Image
              src={image.imageUrl}
              alt={image.caption}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-wine-950/85 to-transparent p-4 text-left text-sm text-paper-50 opacity-0 transition-opacity group-hover:opacity-100">
              {image.caption}
            </span>
          </button>
        ))}
      </div>

      {active &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.caption}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-wine-950/95 p-4"
            onClick={close}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full border border-paper-50/25 text-paper-50"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            <LightboxArrow side="left" onClick={() => step(-1)} />
            <LightboxArrow side="right" onClick={() => step(1)} />

            <div
              className="relative h-[70vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={active.imageUrl} alt={active.caption} fill sizes="100vw" className="object-contain" />
            </div>
            <p className="mt-5 max-w-xl text-center text-sm text-paper-200">{active.caption}</p>
            <p className="mt-1 text-xs text-paper-200/50">
              {openIndex! + 1} of {visible.length}
            </p>
          </div>,
          document.body,
        )}
    </>
  );
}

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
        active
          ? "border-wine-800 bg-wine-800 text-paper-50"
          : "border-ink-900/15 text-ink-700 hover:border-accent/40 hover:text-accent",
      )}
    >
      {children}
    </button>
  );
}

function LightboxArrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={side === "left" ? "Previous image" : "Next image"}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-paper-50/25 text-paper-50 transition-colors hover:bg-paper-50/10",
        side === "left" ? "left-4" : "right-4",
      )}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-5 w-5">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={side === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}
        />
      </svg>
    </button>
  );
}
