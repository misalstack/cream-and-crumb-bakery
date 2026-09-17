/**
 * Small hand-rolled form validation — deliberately no schema library, matching
 * the minimal-dependency approach used elsewhere in this project.
 *
 * Every public Server Action runs these on the server. Client-side `required`
 * attributes are a convenience, never the guarantee.
 */

export type FormErrors = Record<string, string>;

export type ActionState = {
  ok: boolean;
  message?: string;
  errors?: FormErrors;
  /** Set on success when the caller should navigate somewhere. */
  redirectTo?: string;
};

export const EMPTY_STATE: ActionState = { ok: false };

export class Validator {
  readonly errors: FormErrors = {};
  constructor(private readonly data: FormData) {}

  private raw(field: string) {
    const value = this.data.get(field);
    return typeof value === "string" ? value.trim() : "";
  }

  get hasErrors() {
    return Object.keys(this.errors).length > 0;
  }

  required(field: string, label: string, { max = 500 }: { max?: number } = {}) {
    const value = this.raw(field);
    if (!value) this.errors[field] = `${label} is required.`;
    else if (value.length > max) this.errors[field] = `${label} must be under ${max} characters.`;
    return value;
  }

  optional(field: string, label: string, { max = 500 }: { max?: number } = {}) {
    const value = this.raw(field);
    if (value.length > max) this.errors[field] = `${label} must be under ${max} characters.`;
    return value || null;
  }

  /** Accepts local (07…) and international (+250…) Rwandan formats. */
  phone(field: string, label: string) {
    const value = this.raw(field);
    if (!value) {
      this.errors[field] = `${label} is required.`;
      return "";
    }
    const digits = value.replace(/[\s\-()]/g, "");
    if (!/^\+?\d{9,15}$/.test(digits)) {
      this.errors[field] = "Enter a valid phone number, e.g. 0788 000 000.";
    }
    return value;
  }

  email(field: string, label: string, { required = false } = {}) {
    const value = this.raw(field);
    if (!value) {
      if (required) this.errors[field] = `${label} is required.`;
      return null;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
      this.errors[field] = "Enter a valid email address.";
    }
    return value;
  }

  oneOf<T extends string>(field: string, label: string, allowed: readonly T[]): T | "" {
    const value = this.raw(field) as T;
    if (!value) {
      this.errors[field] = `${label} is required.`;
      return "";
    }
    if (!allowed.includes(value)) {
      this.errors[field] = `Choose a valid ${label.toLowerCase()}.`;
      return "";
    }
    return value;
  }

  integer(
    field: string,
    label: string,
    { required = false, min = 0, max = Number.MAX_SAFE_INTEGER }: { required?: boolean; min?: number; max?: number } = {},
  ) {
    const value = this.raw(field);
    if (!value) {
      if (required) this.errors[field] = `${label} is required.`;
      return null;
    }
    const n = Number(value.replace(/[,\s]/g, ""));
    if (!Number.isFinite(n) || !Number.isInteger(n)) {
      this.errors[field] = `${label} must be a whole number.`;
      return null;
    }
    if (n < min || n > max) {
      this.errors[field] = `${label} must be between ${min} and ${max}.`;
      return null;
    }
    return n;
  }

  /** Date-only field; `notBefore` guards against ordering for yesterday. */
  date(field: string, label: string, { required = false, notBefore }: { required?: boolean; notBefore?: Date } = {}) {
    const value = this.raw(field);
    if (!value) {
      if (required) this.errors[field] = `${label} is required.`;
      return null;
    }
    // Parse as UTC midnight so comparisons don't drift with the server's zone.
    const parsed = new Date(`${value}T00:00:00.000Z`);
    if (Number.isNaN(parsed.getTime())) {
      this.errors[field] = `${label} is not a valid date.`;
      return null;
    }
    if (notBefore && parsed.getTime() < notBefore.getTime()) {
      this.errors[field] = `${label} cannot be in the past.`;
      return null;
    }
    return parsed;
  }
}

/** Today at UTC midnight — the floor for "not in the past" date checks. */
export function todayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
