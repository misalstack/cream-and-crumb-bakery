// Kept separate from `theme.ts` because that module imports `next/headers`,
// which breaks if it is pulled into a client bundle.
export const THEME_COOKIE = "theme";

export type Theme = "light" | "dark";
