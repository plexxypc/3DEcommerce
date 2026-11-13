---
name: 3d-ecommerce-performance-and-fallbacks
description: Performance budgets, loading strategy, device tiering, non-3D fallbacks, accessibility, SEO and measurement for WebGL / React Three Fiber shops, especially for low-end phones and mobile data. Use when building or auditing the engineering side of any 3D e-commerce site, setting budgets, or debugging slow/crashing scenes.
---

# 3D e-commerce performance and fallbacks

Assume the median user has a mid-range Android, a cracked-battery budget and metered data. Design for that device first, then enhance upward.

## Architecture rules
1. **3D is progressive enhancement.** Every product has a real URL with server-rendered HTML (name, price, photos, description, structured data). 3D layers on top.
2. **Fallback is a first-class product**, not an error page: same catalogue, same bag, same checkout. Also the SEO/accessibility surface.
3. **Checkout, forms, auth: plain HTML**, outside the canvas.
4. **Data-driven scene:** scene layout and product placement come from JSON/DB; no hard-coded product meshes.
5. **Isolate 3D code:** dynamic-import the canvas (`next/dynamic`, `ssr:false`) so non-3D routes ship no Three.js.

## Capability detection and tiers
Decide on first load (and re-evaluate on FPS drops):

| Signal | How | Result |
| --- | --- | --- |
| WebGL2 unavailable / context lost repeatedly | feature test | **Fallback** |
| `prefers-reduced-motion` | media query | **Fallback** (or minimal-motion) |
| `navigator.connection.saveData`, effectiveType `2g/3g` | Network Information API (where supported) | **Data-saver**: poster + fallback, "Load 3D" opt-in button |
| Low RAM/CPU (`deviceMemory ≤ 2`, `hardwareConcurrency ≤ 4`) | heuristics + GPU benchmark (e.g. `detect-gpu`) | **Low tier** |
| Everything else | | **Mid / High tier** |

Tier settings (starting points):
| | Low | Mid | High |
| --- | --- | --- | --- |
| DPR cap | 1 | 1.5 | 2 |
| Shadows | baked/contact only | contact | soft real-time (1 light) |
| Post-FX | none | FXAA/SMAA | + subtle bloom/vignette |
| Model tier | mobile | mobile | detail on focus |
| Env map | 256 px blurred | 512 | 1k |
| Max live products | 4 | 8 | 16 |

Add **adaptive performance**: `drei` `PerformanceMonitor` lowers DPR/effects when FPS < 30 and restores slowly. Show a quality toggle in settings.

## Loading strategy
- Critical path: HTML + poster (WebP/AVIF, correct dimensions, `fetchpriority=high`) + tiny JS; the Enter button works before the canvas bundle arrives.
- Lazy canvas → hub scene → per-zone assets → per-product models; use `useGLTF.preload` only for the next likely item.
- Draco/Meshopt decoders and KTX2 transcoder served from own CDN, cached long-term; load once, reuse workers.
- Everything immutable-cached with hashed filenames; Service Worker (optional) caches models for repeat visits and weak networks.
- Image sequences/video only when asked; never autoplay heavy video on mobile.
- Third-party scripts (analytics, chat) load after interaction/idle.

## Runtime hygiene (R3F/Three.js)
- `frameloop="demand"` unless something animates; pause when hidden (`visibilitychange`, IntersectionObserver).
- Limit draw calls (< 150 mobile), triangles on screen (< 300k mobile), lights (≤ 3 live), real-time shadow maps (0 on low).
- Reuse geometries/materials; `instancing` for repeated set dressing; no per-frame allocations in `useFrame`.
- **Dispose** textures/geometries/materials when products leave range; track GPU memory in dev.
- Handle `webglcontextlost` / `restored` gracefully (show fallback, offer retry).
- Compress textures (KTX2), cap anisotropy at 4, mip-map everything.
- Antialiasing via post (SMAA) or MSAA only on high.

## Budgets (fail CI / block release)
- JS before interactive: ≤ 250 KB gz (non-3D route), 3D chunk ≤ 350 KB gz.
- Poster LCP ≤ 2.5 s on Slow 4G; INP ≤ 200 ms; CLS ≤ 0.1.
- ≥ 30 fps sustained on the **reference low-end phone** (name it in the PRD).
- Total first-interactive hub ≤ 4 MB.
Track with Lighthouse CI + a real-device smoke test per release (WebPageTest/BrowserStack or a physical phone on throttled network).

## Accessibility and SEO
- Keyboard and screen-reader complete purchase path without the canvas.
- Meaningful `alt`, headings, landmarks; buy buttons are real `<button>`s.
- `prefers-reduced-motion`, `prefers-color-scheme`, and zoom to 200% supported in the 2D shell.
- Structured data (`Product`, `Offer` with price/currency `NGN`/availability), Open Graph images per product (the poster).
- Don't hide content behind the canvas; no text only in textures.

## Error handling and resilience
- If a model fails: show its poster billboard + still allow purchase.
- If the CDN is down: fallback grid still renders from the app's own HTML/images.
- Log (non-PII) events: `3d_start`, `3d_ready_ms`, `fps_tier`, `fallback_reason`, `model_load_fail`, `focus_product`, `add_to_bag`, `checkout_start`, `paid`. Compare 3D vs fallback conversion monthly: if 3D doesn't convert better for a segment, give that segment the fallback.

## Audit checklist
- [ ] Turn off JS: product page still shows name, price, photos, buy path?
- [ ] 4× CPU throttle + Slow 4G: poster < 2.5 s, hub interactive < 8 s?
- [ ] Rotate/zoom/tap for 5 minutes on the reference phone: no crash, no overheating, stable memory?
- [ ] Force WebGL off / reduced motion: full purchase still works?
- [ ] Orientation change, tab switch, low battery mode: recovers cleanly?
- [ ] Lighthouse (mobile) ≥ 80 performance on 2D routes; ≥ 60 on the hub.
