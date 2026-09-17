import { ImageResponse } from "next/og";
import { BAKERY_INFO } from "@/lib/bakery-info";

export const alt = "Sweet Crust — A Heart of Bakery in Africa";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// The card never varies, and the static export refuses to emit a route that
// hasn't opted in to being fully static.
export const dynamic = "force-static";

/**
 * The card shown when the site is shared on WhatsApp, Instagram or Facebook —
 * where most of this bakery's traffic will come from. Drawn rather than
 * photographed so it stays sharp and on-brand at any size.
 */
export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #2b0710 0%, #631026 55%, #7d1631 100%)",
          color: "#fdf9f3",
          fontFamily: "serif",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 132,
            height: 132,
            borderRadius: 66,
            background: "#f7efe3",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 62,
            color: "#631026",
          }}
        >
          SC
        </div>

        <div style={{ display: "flex", marginTop: 34, fontSize: 34, color: "#d4b473" }}>
          {BAKERY_INFO.tagline}
        </div>

        <div style={{ display: "flex", marginTop: 12, fontSize: 96, letterSpacing: 14 }}>SWEET CRUST</div>

        <div style={{ display: "flex", marginTop: 26, fontSize: 28, color: "#ebdfcd" }}>
          Pastries · Celebration Cakes · Boxes — Kigali, Rwanda
        </div>
      </div>
    ),
    size,
  );
}
