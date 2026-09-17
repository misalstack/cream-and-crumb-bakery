import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, Parisienne } from "next/font/google";
import "./globals.css";
import { getTheme } from "@/lib/theme";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const script = Parisienne({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["400"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sweetcrust.rw"),
  title: {
    default: "Crème & Crumb",
    template: "%s · Crème & Crumb",
  },
  description:
    "Sweet Crust is a Kigali bakery and patisserie baking fresh croissants, pies, cookies and celebration cakes daily. Order online for pickup or delivery across Kigali.",
    icons: {
    icon: "/cream-crumb-logo.png",
  },
  openGraph: {
    type: "website",
    siteName: "Sweet Crust",
    locale: "en_RW",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const theme = await getTheme();

  return (
    <html
      lang="en"
      data-theme={theme ?? undefined}
      data-scroll-behavior="smooth"
      className={`${display.variable} ${script.variable} ${body.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/icon.png" sizes="192x192" type="image/png" />
      </head>
      <body className="flex min-h-full flex-col bg-cream-50 text-ink-900">{children}</body>
    </html>
  );
}
