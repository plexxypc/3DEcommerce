---
name: 3d-ecommerce-motion-and-interaction
description: Camera movement, scroll choreography, product inspection, hotspots, transitions, sound and the hand-off from 3D to checkout for 3D web shops. Use when designing or implementing how users move through and interact with a 3D store (React Three Fiber / Three.js), or when reviewing UX of a 3D shopping flow.
---

# 3D e-commerce motion and interaction

Principle: **every motion answers "where am I, what can I do next?"** Motion that only shows off costs conversion and battery.

## Navigation models (pick one per project, justify it)
| Model | Use when | Notes |
| --- | --- | --- |
| **Guided rail** (scroll/swipe moves the camera along a spline) | Curated brand world, <30 products | Most predictable on phones. Default recommendation. |
| **Hotspot-to-hotspot** (tap a zone, camera flies there) | Large catalogues | Easy to make accessible. Pair with a category menu. |
| **Free-roam** (WASD/joystick) | Rarely | Disorienting, high drop-off, hard on touch. Avoid unless the reference demands it. |

Always provide a **menu escape hatch**: category list + "Skip to shop (2D)" reachable from any point.

## Camera rules
- Move with easing (ease-in-out, 600 to 1200 ms for zone changes, 400 to 700 ms for focus). Never linear, never instant-cut except on reduced motion.
- Damping on all user control (`drei` `OrbitControls` damping ~0.08). Clamp polar angle, distance, and pan so users can't lose the product or see behind the set.
- FOV 35 to 50° for products (less distortion); wider only in the hub.
- Keep the horizon level; no roll. Reduce parallax intensity on phones.
- Scroll hijacking: use Lenis/`ScrollControls` smoothing, but never trap the user: native scroll must still reach the footer/fallback, and Esc/back button leave focus mode.
- URL reflects state (`/shop/caps/piece-slug`) so back button, sharing and SEO work. Camera animates to match the route, not the other way round.

## Product focus (inspect) interaction
1. Tap/click product → camera eases in, scene dims (other products fade to ~25% and stop animating), UI panel appears. Total ≤ 800 ms.
2. Drag rotates (inertia), pinch/scroll zooms (clamped to 0.6× to 2.5× default distance), double-tap resets.
3. **Hotspots** (max 5 per piece): small pulsing dots anchored to the mesh; tap shows a one-line caption + optional close-up camera nudge. Dots hide when occluded or behind the product.
4. First-time hint ("Drag to rotate") appears once, then never again (store in localStorage with try/catch).
5. Provide **Reset view** and **Close** buttons; Esc and browser back close.
6. Offer **photo gallery tab** in the buy panel (real photos beside the 3D) - buyers trust photos.
7. Do not auto-rotate while the user is interacting; idle auto-rotate resumes after 4 s and stops on reduced motion.

## Hand-off to buying (conversion-critical)
- Buy panel is **2D HTML** over the canvas (accessible, selectable, autofill-friendly). Never render prices/forms inside WebGL.
- Panel shows: name, price, availability, size/fit, short story, primary button, secondary "Ask on WhatsApp / chat", delivery estimate.
- "Add to bag" gives instant feedback (bag icon bump + haptic where available) and **doesn't leave the focus view**. Checkout is a separate normal page/sheet.
- For one-of-one items: on add, reserve stock and show a hold timer; if lost to someone else, say so plainly and suggest alternatives.
- Optimistic UI is fine; payment state comes from the server only.

## Loading and transition choreography
- Poster image → soft fade into live canvas (≤ 400 ms) once first frame renders. No blank/black frames.
- Progress shown as a thin bar plus real text ("Loading the studio: 62%"). Don't fake progress.
- Stream products by proximity to camera; show a low-poly/placeholder or poster billboard first, swap to full model with a quick crossfade.
- Preload the **next** likely piece when the user dwells on a hotspot.

## Sound (optional, P2)
Off by default, single toggle persisted, starts only after a user gesture, ducks when tab hidden. Keep <300 KB total ambient + UI sounds (short, compressed). Never autoplay music.

## Input and accessibility
- Pointer, touch and keyboard parity: Tab moves between products in order, Enter focuses, arrow keys orbit, +/- zoom, Esc exits.
- `prefers-reduced-motion`: switch to cut transitions or the 2D fallback; no auto-rotate, no parallax.
- Announce focus changes to screen readers (`aria-live` region: "Viewing: Gold pin-studded cap, ₦45,000, 1 available").
- Canvas gets `role="img"` with a text alternative; the product list in DOM mirrors what's in the scene.
- Touch: avoid gestures that conflict with page scroll; use `touch-action` deliberately; no two-finger traps; let a single drag orbit only in focus mode.

## Performance coupling (interaction must never cause jank)
- Render on demand (`frameloop="demand"`) when nothing animates; invalidate on interaction.
- Pause the render loop when the tab is hidden or the canvas is off-screen.
- Keep per-frame JS allocation-free in `useFrame`.
- Budget interaction latency: tap→response ≤ 100 ms.

## Review checklist
- [ ] A new user finds "Buy" in < 10 s, without a tutorial.
- [ ] Back button, Esc, deep link and share link all behave.
- [ ] Works one-handed on a 6" phone.
- [ ] Reduced-motion and no-WebGL paths still complete a purchase.
- [ ] Nothing animates when nothing is happening (battery).
- [ ] Hotspot captions are readable and don't overlap each other.
