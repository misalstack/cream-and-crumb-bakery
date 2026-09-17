import type { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold tracking-wide transition-colors disabled:opacity-50 disabled:pointer-events-none";

const buttonVariants = {
  primary: "bg-wine-800 text-paper-50 hover:bg-wine-700",
  gold: "bg-gold-400 text-wine-950 hover:bg-gold-300",
  outline: "border border-accent/30 text-accent hover:bg-accent/10",
  onDark: "border border-paper-50/40 text-paper-50 hover:bg-paper-50/10",
  ghost: "text-ink-900 hover:bg-ink-900/5",
};

type Variant = keyof typeof buttonVariants;

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={cn(buttonBase, buttonVariants[variant], className)} {...props} />;
}

export function LinkButton({
  variant = "primary",
  className,
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; href: string }) {
  return <Link href={href} className={cn(buttonBase, buttonVariants[variant], className)} {...props} />;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("flourish font-script text-xl text-gold-600", className)}>
      <span>{children}</span>
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <div className={cn("mb-3", align === "center" && "flex justify-center")}>
          <Eyebrow>{eyebrow}</Eyebrow>
        </div>
      )}

      <h2
        className={cn(
          "font-display text-4xl leading-tight sm:text-5xl",
          "text-[#2A1810] dark:text-paper-50"
        )}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            "text-[#3A2318] dark:text-paper-200"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}


export function GoldRule({ className }: { className?: string }) {
  return <div className={cn("gold-rule", className)} />;
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-ink-900/10 bg-surface shadow-sm", className)}>{children}</div>
  );
}

const fieldBase =
  "w-full rounded-lg border border-ink-900/15 bg-surface px-3.5 py-2.5 text-sm text-ink-900 outline-none transition-colors placeholder:text-ink-700/50 focus:border-accent focus:ring-1 focus:ring-accent";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldBase, props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(fieldBase, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(fieldBase, props.className)} />;
}

export function Label({ htmlFor, children }: { htmlFor?: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-700">
      {children}
    </label>
  );
}

export function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "wine" | "gold" | "blush" | "success" | "danger";
}) {
  const tones = {
    neutral: "bg-ink-900/5 text-ink-700",
    wine: "bg-wine-800/10 text-accent",
    gold: "bg-gold-400 text-wine-950",
    blush: "bg-blush-300/40 text-accent",
    success: "bg-emerald-500/15 text-positive",
    danger: "bg-red-500/15 text-negative",
  };
  return (
    <span className={cn("inline-flex items-center rounded-full px-3 py-1 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-1.5 text-xs font-medium text-negative">{children}</p>;
}

export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink-900/15 px-6 py-14 text-center">
      <p className="font-display text-2xl text-ink-900">{title}</p>
      {body && <p className="mx-auto mt-2 max-w-md text-sm text-ink-700">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}