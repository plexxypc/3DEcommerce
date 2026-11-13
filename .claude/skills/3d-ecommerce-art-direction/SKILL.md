---
name: 3d-ecommerce-art-direction
description: Art direction rules for 3D web shops - scene look, lighting, materials, composition, typography, the 2D UI shell around the canvas, and brand tokens. Use when designing or reviewing the visual side of any 3D e-commerce site, building a scene, choosing lights/colours/type, or briefing a designer or 3D artist.
---

# 3D e-commerce art direction

Goal: make the product look desirable and **trustworthy** at a glance. Beautiful but unclear loses sales.

## Start here: write the brand sheet
Before touching a scene, fill this in (get it from the owner; infer from their Instagram/site only as a draft and mark it unconfirmed). Keep it in the project as `docs/<project>/brand.md` and mirror it in code as tokens.

```
Mood words (3):            e.g. maximalist, street, irreverent
Ground (background) colour: near-black #0B0B0C
Accent colours (max 3):     metals, a signature pop, a warning/sold colour
Material language:          leather, brass, enamel, washed cotton…
Photography style:          hard flash / soft studio / outdoors
Type:                       one display face, one text face (≤ 2 families total)
Logo files + clear space:   SVG, light + dark versions
Do / Don't list:            3 each
```

## Core principles
1. **Product is the brightest, most saturated, sharpest thing on screen.** Dim and desaturate everything else (environment, neighbours, UI).
2. **Composition first, effects second.** Decide the camera framing of each hero shot like a photographer; then add atmosphere. Fog, bloom and grain are seasoning, never the meal.
3. **One light story.** A hard key, a coloured rim, a low ambient. Same story in every zone so the world feels like one place; vary colour temperature per zone, not the rig.
4. **Honest materials.** Gold looks like gold only with a good environment map and roughness 0.15 to 0.35; fabric needs normal detail, not shine. Never let post-effects hide a weak model.
5. **Show scale.** Add a human cue (a hand, a mannequin, a ruler hotspot, size note in cm). Buyers need to know how big it is.
6. **Show the flaw-free truth.** Colour on screen should match the photo/real item. Calibrate with a reference card when scanning; keep tone-mapping consistent (ACES or AgX) across all products.
7. **Clutter is a choice.** A maximalist brand can have dense set dressing, but only *behind* the focus plane and only low-contrast. Focus view always clears the stage.

## Lighting recipes (starting points)
- **Hard-flash street** (dark, punchy): 1 directional key, shadow bias tuned, strong contrast, warm rim light from behind, ambient ≤ 0.2, backdrop texture (plaster, cloth) lit at a grazing angle.
- **Soft studio** (clean luxury): large area-light feel (use an HDRI softbox), ambient 0.5, gentle contact shadow, neutral grey ground.
- **Gallery spot**: one top spotlight per plinth, deep falloff, cool darkness between pieces.
Always bake or fake shadows on mobile (contact-shadow plane or baked lightmap) instead of real-time shadow maps.

## Colour and type for the 2D shell
- The canvas is the hero; the shell (header, bag, buy panel) is **quiet**: ground colour at 85 to 95% opacity, hairline borders, one accent for the primary action.
- Contrast ≥ 4.5:1 for text, ≥ 3:1 for controls, tested on top of moving 3D backgrounds (use a solid/blurred panel behind text, never raw text on the canvas).
- Price, availability ("Only 1 left", "Sold"), and the Buy button must be legible **without** interacting with the scene.
- Display type may be expressive; price, size, delivery info use a plain, tabular, highly legible text face.
- Minimum tap target 44×44 px; thumb-reachable primary actions on phones (bottom sheet pattern).

## Layout patterns
- **Hub:** zones with a clear silhouette per category so users orient without text; labels appear on approach.
- **Focus:** piece centred at 55 to 65% of viewport height, desktop: panel on the right; phone: bottom sheet (collapsed = name, price, Buy).
- **Sold/unavailable:** keep in the scene, desaturate ~40%, tag clearly, offer "ask for something similar".

## Review checklist (run before calling any scene "done")
- [ ] Screenshot at 360×800 phone, 1440×900 laptop. Is the product the focus within 1 second?
- [ ] Can you read price + Buy without moving the camera?
- [ ] Gold/metal looks right against two different environments?
- [ ] Colours match the real item photo (side-by-side)?
- [ ] Nothing important is under the notch/home bar/browser chrome?
- [ ] Looks acceptable with effects turned off (low tier)?
- [ ] Brand sheet do/don't list respected?

## Anti-patterns
White void with floating products (generic, no brand); heavy bloom on everything; text baked into 3D that can't be read or translated; auto-rotating products that fight user drag; giant loading logos that hide the scene for >3 s; pure-black UI on pure-black scene with no separation.
