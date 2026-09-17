import { cookies } from "next/headers";
import { IS_DEMO } from "@/lib/demo";
import { THEME_COOKIE, type Theme } from "@/lib/theme-constants";

export { THEME_COOKIE, type Theme } from "@/lib/theme-constants";

// Returns null when the visitor hasn't explicitly chosen — in that case the
// CSS `@media (prefers-color-scheme: dark)` rule picks the default, so we
// deliberately don't guess here (avoids baking a wrong choice into SSR).
export async function getTheme(): Promise<Theme | null> {
  // A static export has no request to read a cookie from; fall through to the
  // CSS `prefers-color-scheme` default.
  if (IS_DEMO) return null;
  const store = await cookies();
  const val = store.get(THEME_COOKIE)?.value;
  return val === "light" || val === "dark" ? val : null;
}
