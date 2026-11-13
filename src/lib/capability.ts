export type Tier = "fallback" | "data-saver" | "low" | "mid" | "high";

// Decide on first load. 3D is progressive enhancement: anything doubtful -> 2D shop.
export function detectTier(): { tier: Tier; reason?: string } {
  try {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return { tier: "fallback", reason: "reduced-motion" };
    const c = document.createElement("canvas");
    if (!c.getContext("webgl2")) return { tier: "fallback", reason: "no-webgl2" };
    const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number };
    if (nav.connection?.saveData || /^(slow-2g|2g|3g)$/.test(nav.connection?.effectiveType ?? "")) return { tier: "data-saver", reason: "network" };
    if ((nav.deviceMemory ?? 8) <= 2 || (navigator.hardwareConcurrency ?? 8) <= 4) return { tier: "low" };
    // iPhone 11 (reference device) lands in mid via the default path.
    return { tier: window.devicePixelRatio > 2 ? "high" : "mid" };
  } catch {
    return { tier: "fallback", reason: "error" };
  }
}
export const dprCap = (t: Tier) => (t === "low" ? 1 : t === "mid" ? 1.5 : 2);
