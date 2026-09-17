import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { BrandLockup } from "@/components/BrandLogo";
import { getStaffSession } from "@/lib/auth";
import { IS_DEMO } from "@/lib/demo";

export const metadata: Metadata = {
  title: "Staff Login",
  robots: { index: false },
};

export default async function AdminLoginPage() {
  // Already signed in — skip the form. The demo always reports a session, so
  // it would never show this page; keep it visible there since the login
  // screen is part of what the client is being shown.
  if (!IS_DEMO && (await getStaffSession())) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-wine-950 px-5 py-16">
      <div className="w-full max-w-md">
        <div className="flex justify-center">
          <BrandLockup tone="dark" showTagline />
        </div>

        <div className="mt-10 rounded-3xl bg-surface p-8 shadow-xl">
          <h1 className="font-display text-3xl text-ink-900">Staff login</h1>
          <p className="mt-1.5 text-sm text-ink-700">
            For Sweet Crust staff only. Customers do not need an account to order.
          </p>
          <div className="mt-7">
            <LoginForm />
          </div>
        </div>
      </div>
    </main>
  );
}
