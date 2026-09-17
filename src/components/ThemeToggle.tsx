"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { THEME_COOKIE, type Theme } from "@/lib/theme-constants";
import { setPreferenceCookie } from "@/lib/cookies";
import { cn } from "@/lib/cn";

export function ThemeToggle({ theme: initialTheme }: { theme: Theme | null }) {
  const router = useRouter();
  const [activeTheme, setActiveTheme] = useState<Theme>(initialTheme || "dark");

  useEffect(() => {
    // Page load par theme Apply karna
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [activeTheme]);

  function handleThemeChange(next: Theme) {
    setActiveTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    setPreferenceCookie(THEME_COOKIE, next);
    router.refresh();
  }

  return (
    <div className="flex items-center rounded-full border border-gold-500/40 p-0.5 text-xs font-semibold">
      <button
        type="button"
        aria-label="Light mode"
        aria-pressed={activeTheme === "light"}
        onClick={() => handleThemeChange("light")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200",
          activeTheme === "light"
            ? "bg-gold-500 text-wine-950 shadow-sm"
            : "text-ink-700 hover:text-accent"
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
          <circle cx="12" cy="12" r="4" />
          <path
            strokeLinecap="round"
            d="M12 3v1.5M12 19.5V21M4.6 4.6l1.1 1.1M18.3 18.3l1.1 1.1M3 12h1.5M19.5 12H21M4.6 19.4l1.1-1.1M18.3 5.7l1.1-1.1"
          />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Dark mode"
        aria-pressed={activeTheme === "dark"}
        onClick={() => handleThemeChange("dark")}
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200",
          activeTheme === "dark"
            ? "bg-gold-500 text-wine-950 shadow-sm"
            : "text-ink-700 hover:text-accent"
        )}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
          <path d="M20.5 14.5a8.5 8.5 0 1 1-9-11 7 7 0 0 0 9 11Z" />
        </svg>
      </button>
    </div>
  );
}