// Generates clearly-labelled placeholder product images. Real photography replaces these.
import { writeFileSync } from "node:fs";
const items = {
  "brass-brooch-cap": ["#C9A24B", "#3a2a0a"], "jewelled-boots": ["#8B1A1A", "#2a0808"],
  "pinned-leather-jacket": ["#4a4a4f", "#111113"], "gold-sculpt-cuff": ["#E0B857", "#5a3f0c"],
  "patchwork-tee": ["#E8478B", "#3a0f22"], "crt-portrait-print": ["#6f8f6a", "#1b2a1a"],
};
for (const [slug, [a, b]] of Object.entries(items)) {
  const label = slug.replace(/-/g, " ");
  writeFileSync(`public/products/${slug}.svg`, `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000"><defs><radialGradient id="g" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></radialGradient></defs><rect width="800" height="1000" fill="url(#g)"/><text x="400" y="520" font-family="Georgia,serif" font-size="44" fill="#EDE3D0" text-anchor="middle">${label}</text><text x="400" y="580" font-family="monospace" font-size="22" fill="#EDE3D0" fill-opacity=".6" text-anchor="middle">placeholder image</text></svg>`);
}
