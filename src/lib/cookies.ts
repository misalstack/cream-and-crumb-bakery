/**
 * Writes a first-party preference cookie that lasts a year.
 *
 * Kept in a module rather than inline in a component because assigning to
 * `document.cookie` from a component body trips the React compiler's
 * immutability lint (it can't tell a browser API write from mutating shared
 * module state).
 */
export function setPreferenceCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
}
