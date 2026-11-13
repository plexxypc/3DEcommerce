# PRD: adelana 3D Store

Status: Draft v0.1 · 13 November 2026 · Owner: princeserox
Brand reference: instagram.com/adelanaaaaaaaa (adeLAna, "Creative Director · Image / Products / Design")

> **Evidence base and gaps.** This draft is built from one screen recording of the brand's Instagram profile and a screenshot of it. The ZIP of reference videos described in the brief did **not** arrive (only one MP4 was uploaded). Every section tagged **[ASSUMED]** must be checked against those videos. Section 13 lists the questions that need answers before development starts.
>
---

## 1. Summary

A browser-based 3D shopping experience for adelana: a Lagos-based creative director who makes hand-embellished, one-of-one fashion and accessories (patched and pinned caps, jewelled and charm-covered boots, brooch-encrusted jackets, sculptural gold jewellery, graphic tees) and takes private commissions.

Visitors don't scroll a grid. They walk or fly through a world, pick up a piece, turn it in 3D, zoom into the details (every pin and patch is the product), and buy it. The experience must still work on a mid-range Android phone over mobile data, because that is where most Nigerian traffic is.

## 2. Problem and opportunity

- **Today** the brand sells through Instagram posts and a WhatsApp link (`wa.me/c/2348101169734`, a WhatsApp catalogue). A flat photo cannot show what makes the work valuable: depth, texture, the density of embellishment, the fact that each piece is different.
- **Opportunity:** the product *is* a visual object. 3D inspection turns the detail into a reason to buy, and a distinctive site makes the brand memorable and shareable. It also positions the brand beyond Instagram dependence.
- **Risk:** 3D shops often look good and convert badly (slow, confusing, no obvious "Buy"). This PRD treats conversion and speed as hard requirements, not afterthoughts.

## 3. Goals and non-goals

### Goals
1. Make a visitor want to touch the product: inspect any piece in 3D at ≥ 30 fps on a mid-range phone.
2. Convert: a first-time visitor can go from landing to paid order in under 3 minutes.
3. Fit how the brand actually sells: one-of-one stock, limited drops, private commissions, WhatsApp conversations.
4. Be reusable: the architecture, design rules and asset pipeline become a template for other 3D shops (captured in `.claude/skills/3d-ecommerce-*`).

### Non-goals (v1)
- Full open-world game, avatars, multiplayer.
- AR try-on of clothing on the body (AR *placement* view for accessories is stretch only).
- Marketplace for other sellers.
- Native apps.
- International shipping and multi-currency (naira first; see Section 13).

## 4. Users

| Persona | Needs | Notes |
| --- | --- | --- |
| **Instagram follower** (primary) | Arrives from a bio link or story on a phone, on mobile data. Wants to see the new piece fast and buy without friction. | 1,500+ followers, mostly Nigerian, creative and fashion-aware. |
| **Collector / stylist** | Close inspection of craft, provenance, sizing, authenticity. | Likely desktop. Spends the longest time per piece. |
| **Commission client** | Wants something made for them. | Today handled by DM; needs a brief form + deposit. |
| **Brand owner (admin)** | Add a piece, mark it sold, run a drop, see orders, without touching code or a 3D tool. | Non-technical. |

## 5. Experience concept **[ASSUMED, validate against the reference videos]**

Working concept: **"The Studio"**: a dark, moody room that feels like the brand's feed made physical. Pieces float, hang or sit on plinths in a loose collage. Camera moves are guided (scroll or tap-driven rails), with free orbit only when inspecting a piece.

Flow:

1. **Entry (≤ 3 s to something visible).** Logo mark and a poster image appear instantly while the 3D scene streams in behind. A "Enter" action doubles as the user gesture needed for audio and fullscreen.
2. **The Studio (hub).** Camera glides through zones: *Caps, Footwear, Outerwear, Jewellery, Tees/Prints* (**[ASSUMED]** categories from the profile). Scroll/swipe moves along the path. Each zone shows 3 to 6 hero pieces.
3. **Piece focus.** Tap a piece: camera eases to it, background dims, piece becomes orbitable (drag to rotate, pinch/scroll to zoom). Hotspots mark details ("vintage brooch", "hand-sewn patch") with a short caption.
4. **Buy panel.** Price in ₦, size/fit where relevant, "Only 1 available" badge, **Add to bag** and **Buy now**, plus **Ask on WhatsApp** (pre-filled with the piece name and link).
5. **Bag and checkout.** Standard, fast, 2D (never inside the 3D canvas). Paystack in NGN.
6. **Commission flow.** "Make me something" opens a short brief form (what, budget, deadline, reference images) and a deposit payment or a WhatsApp handoff.
7. **Drops.** A countdown room for upcoming releases with email/WhatsApp reminder sign-up.

Design principles: see `.claude/skills/3d-ecommerce-art-direction` and `3d-ecommerce-motion-and-interaction`. Short version: the product is always the brightest thing on screen; every motion explains where you are; the 2D UI is calm and fast.

## 6. Brand and visual direction (from the profile)

Observed from the screenshot and video:

- **Palette:** near-black ground; warm metallics (gold, brass), deep reds, olive/khaki, cream; saturated pops from patches (pink, yellow, blue).
- **Material language:** gold-plated sculpture, leather, washed cotton, embroidery, enamel pins, rhinestones, brooches, patches.
- **Mood:** maximalist, collage, thrift-remix, Lagos street culture, editorial portraiture, retro devices (the CRT-TV-holding portrait). Confident, a bit irreverent. Wordmark "adeLAna" with an LA-style interlocking A.
- **Photography:** hard flash, textured backdrops (plaster walls, patterned cloth), tight crops.

3D art direction implication: **dark studio with hard key light and warm rim light, tactile close-ups, visible clutter around hero pieces**, not a clean white void. Final tokens (colours, type, logo files) are required from the owner (Section 13).

## 7. Functional requirements

Priority: **P0** = launch blocker, **P1** = launch target, **P2** = later.

### 7.1 Storefront / 3D
| ID | Requirement | P |
| --- | --- | --- |
| F1 | 3D hub scene with guided camera path, working with touch, mouse and keyboard. | P0 |
| F2 | Piece focus view: orbit, zoom (clamped), reset, hotspots with captions. | P0 |
| F3 | Poster-first loading: static image shown instantly; 3D scene lazy-loaded; products load progressively (low-res first, detail on focus). | P0 |
| F4 | **Non-3D fallback** (grid + photo gallery) for no-WebGL, data-saver mode, reduced motion, or low-power devices, with the same buy flow. Also the SEO/accessible version. | P0 |
| F5 | Category navigation (menu + in-scene), search by name. | P1 |
| F6 | Sound: ambient bed and interaction sounds, **off by default**, one clear toggle. | P2 |
| F7 | AR "view in your space" for accessories (model-viewer / WebXR). | P2 |

### 7.2 Commerce
| ID | Requirement | P |
| --- | --- | --- |
| C1 | Product model supports **unique items (stock = 1)** and multi-quantity items; sold pieces stay visible with a "Sold" state and "Make me one like this" link. | P0 |
| C2 | Cart/bag with stock reservation (hold 10 min at checkout so two people can't buy the same one-off). | P0 |
| C3 | Paystack checkout in NGN (cards, transfer, USSD); order confirmed only after webhook verification. | P0 |
| C4 | Delivery: address capture, Nigerian state/LGA-aware shipping fee table, pickup option **[ASSUMED]**. | P0 |
| C5 | Order emails and WhatsApp-friendly order summary. | P1 |
| C6 | Commission request form with image upload, optional deposit. | P1 |
| C7 | Drop scheduling: items hidden until a release time; countdown; reminder sign-up. | P1 |
| C8 | Discount codes. | P2 |
| C9 | Guest checkout by default; accounts optional (order lookup by email + order number). | P0 |

### 7.3 Admin (non-technical owner)
| ID | Requirement | P |
| --- | --- | --- |
| A1 | Create/edit a product: name, price, story, category, size, stock, photos, 3D model upload, hotspot placement, preview. | P0 |
| A2 | Mark sold / restock / schedule a drop. | P0 |
| A3 | Order list with status (paid, packed, shipped, delivered) and customer notice. | P0 |
| A4 | Scene layout editor: drag pieces to positions in a zone (simple), or choose from preset layouts. | P1 |
| A5 | Basic analytics: visits, 3D engaged vs fallback, add-to-bag, checkout conversion. | P1 |

### 7.4 Content pages
Home/Studio, Shop (fallback grid), Product pages (real URLs, indexable, share cards with product image), About, Commissions, Shipping & Returns, Terms, Privacy, Contact.

## 8. Non-functional requirements

| Area | Target |
| --- | --- |
| **First paint** | Brand poster + Enter button within 2 s on 4G (Lighthouse "Slow 4G" profile). |
| **Initial download** | ≤ 1.5 MB before the scene starts; ≤ 4 MB to reach interactive hub on a phone. |
| **Per-product model** | ≤ 1.5 MB (mobile tier) with ≤ 50k triangles and ≤ 2k px textures in KTX2/WebP. A 4k "detail" tier loads only on focus, on capable devices. |
| **Frame rate** | ≥ 30 fps on a reference mid-range Android (define device in Section 13); ≥ 60 fps desktop. Dynamic resolution scaling below 30 fps. |
| **Memory** | Dispose of off-screen products; stay under ~300 MB GPU on mobile. |
| **Core Web Vitals** | LCP ≤ 2.5 s (poster), INP ≤ 200 ms, CLS ≤ 0.1. |
| **Accessibility** | Full keyboard path; focus-visible; reduced-motion = fallback mode; text/controls meet WCAG AA contrast; every product has alt text and a plain-text description; the 3D canvas is never the only way to buy. |
| **Security** | Payments only via Paystack; webhook signature verified; admin behind auth; uploads validated and size-limited; secrets in env vars only. |
| **Reliability** | Site usable if 3D assets or CDN fail (fallback grid). |
| **Browsers** | Last 2 versions of Chrome, Safari (iOS 16+), Samsung Internet, Firefox, Edge. |

## 9. Technical approach (proposed)

| Concern | Choice | Why |
| --- | --- | --- |
| App | Next.js (App Router, TypeScript) | Real URLs and SSR for product/SEO pages; matches owner's existing stack |
| 3D | Three.js via **React Three Fiber** + **drei** | Mature, declarative, big ecosystem |
| Scroll/camera rail | Lenis + GSAP (or drei `ScrollControls`) | Smooth, controllable camera path |
| Models | glTF/GLB, Draco/Meshopt geometry, **KTX2/Basis** textures | Smallest reliable web delivery |
| Asset hosting | Cloudflare R2 + CDN | Cheap egress, global cache, already used in sibling project |
| Database | MySQL + Drizzle ORM (or the owner's preference) | Reuse known setup |
| Payments | Paystack (NGN) | Local methods, webhook model |
| Auth | Admin only: Auth.js; customers guest | Less friction |
| Hosting | Hostinger Node.js app **[ASSUMED]**; heavy assets on R2/CDN, never inside the app directory | Matches existing decisions. Revisit if serverless/edge is needed |
| Analytics | Privacy-friendly (Plausible/PostHog) + custom 3D events | Measure 3D vs fallback conversion |

Key architecture rules (detail in the skills):
- **3D is progressive enhancement.** The shop works without it.
- **Product data is the source of truth**; the scene is generated from it (positions, model URL, hotspots in JSON), not hard-coded.
- **Checkout is never inside the canvas.**
- One shared scene/product renderer for hub, focus view and admin preview.

## 10. 3D asset pipeline (summary)

Each piece is unique and handmade, so assets are captured per item:

1. **Capture:** turntable photography (60 to 120 frames, hard-flash and soft-box sets) or photogrammetry/Gaussian-splat scan; phone LiDAR for rough form.
2. **Reconstruct and clean:** photogrammetry (RealityCapture/Meshroom/Polycam/Luma) → clean in Blender; retopologise.
3. **Bake and optimise:** bake normal/AO to a low-poly mesh; metals (gold, brass) given correct PBR values.
4. **Compress:** gltf-transform → Meshopt/Draco + KTX2; produce **mobile** and **detail** tiers and a poster WebP.
5. **QA:** checklist per model (size budget, scale in cm, pivot at base, no inverted normals, looks right under the shop's lighting).
6. **Publish:** upload via admin; hotspots placed in preview.

Reflective gold and shiny sequins are the hardest case for scans. Plan to hand-polish those models and fake spec with environment maps. Full procedure: `.claude/skills/3d-ecommerce-asset-pipeline`.

## 11. Metrics

| Metric | Target (first 90 days) **[ASSUMED]** |
| --- | --- |
| Landing → enters the Studio | ≥ 70% |
| Enters → views a piece in 3D | ≥ 50% |
| Piece view → add to bag | ≥ 8% |
| Bag → paid | ≥ 40% |
| Median time-to-interactive (mid-range Android, 4G) | ≤ 6 s |
| Fallback-mode share (tracked, not a failure) | Report only |
| Sell-through of a drop within 7 days | Owner to set |

## 12. Milestones **[ASSUMED, adjust after scope confirmation]**

| Phase | Outcome | Rough duration |
| --- | --- | --- |
| 0. Discovery | Reference videos reviewed, brand assets in, decisions in Section 13 closed, new repo created | 1 week |
| 1. Foundation | App skeleton, design tokens, fallback shop (grid, product page, bag), Paystack test checkout | 2 weeks |
| 2. 3D core | Hub scene, camera rail, piece focus, loading/poster/fallback logic, 3 real scanned pieces | 3 weeks |
| 3. Scale content | Asset pipeline proven; 12 to 20 pieces; hotspots; categories | 2 weeks |
| 4. Admin + orders | Admin CRUD, orders, emails, stock reservation, commissions | 2 weeks |
| 5. Polish and perf | Device testing, budgets enforced, sound (optional), a11y pass | 2 weeks |
| 6. Beta → launch | Invite-only beta, fixes, Paystack live, launch drop | 2 weeks |

Dates are not committed until Section 13 is answered. 3D asset production (scanning 12 to 20 pieces) is the most likely schedule risk.

## 13. Open questions (need the owner)

1. **Reference videos:** please re-send the ZIP. Which specific behaviours do you want (camera movement, product interaction, transitions, sound)?
2. **Who is the owner of the brand/site?** Is this the brand owner's own project or a commission? Do they have approved logo files, fonts and colours?
3. **Catalogue size at launch** and how often new pieces drop. Are all pieces one-of-one?
4. **Shipping:** Lagos-only at launch, nationwide, or international? Who is the courier? Fee rules?
5. **Domain and hosting:** is the site meant to live on Hostinger like LesMemora, or elsewhere? Existing domain?
6. **Who produces 3D models?** Brand owner scanning in-house, a 3D artist, or a mix? Budget per model?
7. **Reference device** for performance testing (which phone does the audience actually use?).
8. **Keep the WhatsApp catalogue** as a parallel channel? (Recommended: yes, with deep links from the site.)
9. **Returns and custom-made policy** (affects checkout copy and legal pages).
10. **Budget and deadline**, including any launch date or drop to anchor to.

## 14. Risks

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Heavy 3D on low-end phones | Slow/crashing → lost sales | Hard budgets, device tiers, fallback grid, test on real devices from Phase 2 |
| Reflective/embellished items scan badly | Models look broken | Pilot 3 pieces first; hand-clean; env-map spec; fall back to photo turntable (image sequence) for any piece that fails |
| Model production cost/time | Launch slips | Pipeline per piece with a time budget; start with fewer, better pieces |
| One-of-one stock oversold | Refunds, trust damage | Stock reservation + atomic decrement at payment webhook |
| Hostinger limits (RAM, build time, 2 deployments) | Build failures | Assets off-box on R2; keep dependencies lean; consider moving host |
| Data cost for users | Bounce | Data-saver mode, size budgets shown in analytics, never autoplay heavy video |
| Scope creep into "game" | Never ships | Non-goals in Section 3; every feature must serve "see it, trust it, buy it" |

## 15. Related files

- `.claude/skills/3d-ecommerce-art-direction/SKILL.md`: look, lighting, materials, UI shell, brand tokens.
- `.claude/skills/3d-ecommerce-motion-and-interaction/SKILL.md`: camera, scroll, inspect, hotspots, buy-flow handoff, sound.
- `.claude/skills/3d-ecommerce-asset-pipeline/SKILL.md`: capture → GLB → CDN, budgets, QA checklist.
- `.claude/skills/3d-ecommerce-performance-and-fallbacks/SKILL.md`: loading strategy, device tiers, fallback, accessibility, measuring.
