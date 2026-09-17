import Link from "next/link";
import { redirect } from "next/navigation";
import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/AdminNav";
import { BrandLockup } from "@/components/BrandLogo";
import { DemoBanner } from "@/demo/DemoBanner";
import { Container } from "@/components/ui";
import { getStaffSession } from "@/lib/auth";
import { IS_DEMO } from "@/lib/demo";

// This layout sits in a `(protected)` route group that is a SIBLING of
// `admin/login`, not a parent of it. Guarding all of `/admin/*` from one
// layout would include the login page itself and loop redirects forever.
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getStaffSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <DemoBanner />
      <header className="bg-wine-950 text-paper-50">
        <Container className="flex h-16 items-center justify-between gap-4">
          <Link href="/admin" aria-label="Sweet Crust admin — dashboard">
            <BrandLockup tone="dark" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/" className="hidden text-sm text-paper-200 hover:text-gold-300 sm:block">
              View site ↗
            </Link>
            <span className="hidden text-sm text-paper-200 md:block">
              {session.name} · {session.role.toLowerCase()}
            </span>
            {/* The demo has no session to end, and a static export cannot take
                a Server Action on a <form> — link back to the login screen. */}
            {IS_DEMO ? (
              <Link
                href="/admin/login"
                className="rounded-full border border-paper-50/25 px-4 py-1.5 text-sm transition-colors hover:bg-paper-50/10"
              >
                Sign out
              </Link>
            ) : (
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-full border border-paper-50/25 px-4 py-1.5 text-sm transition-colors hover:bg-paper-50/10"
                >
                  Sign out
                </button>
              </form>
            )}
          </div>
        </Container>
        <AdminNav />
      </header>

      <main className="flex-1 py-10">
        <Container>{children}</Container>
      </main>
    </div>
  );
}
