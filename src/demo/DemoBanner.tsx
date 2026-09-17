import { DEMO_NOTICE, IS_DEMO } from "@/lib/demo";

/**
 * A thin strip across the top of the static preview. Without it, a client
 * clicking "Place order" and getting a confirmation could reasonably think a
 * real order went through. Renders nothing in the live build.
 */
export function DemoBanner() {
  if (!IS_DEMO) return null;

  return (
    <div className="bg-gold-400 px-4 py-2 text-center text-xs font-medium text-wine-950">
      {DEMO_NOTICE}
    </div>
  );
}
