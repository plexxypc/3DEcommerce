# Image prompt pack: adelana prototype

Run these in Google Flow (or any image generator), as in the reference videos. Brand look comes from PRD Section 6 (unconfirmed, inferred from Instagram). Use the same **style block** on every prompt so the set looks like one world.

## Style block (append to every prompt)
> Hard direct flash photography, deep near-black ground, warm gold and brass highlights, deep red rim light, textured plaster wall, editorial fashion catalogue, tight crop, sharp focus on the piece, maximalist hand-embellishment visible, no text, no watermark, no people, no brand logos.

## Product images (one per piece)
Output **4:5 portrait, 1600x2000**, subject centred, filling 60 to 70% of the frame, plain dark backdrop so the scene can light it. Save as `public/products/<slug>.webp` (quality 80, aim for under 150 KB; compress with squoosh or `cwebp -q 80`).

| Slug | Prompt (then add the style block) |
| --- | --- |
| `brass-brooch-cap` | A washed khaki baseball cap completely covered in vintage brass brooches, pins and charms, front three-quarter view, floating on a dark plaster backdrop |
| `jewelled-boots` | A pair of black leather boots dressed with gold chains, charms and rhinestones, side view, standing on a small dark plinth |
| `pinned-leather-jacket` | A 90s black leather jacket on an invisible mannequin, hundreds of enamel pins and patches across the chest and sleeves, front view |
| `gold-sculpt-cuff` | A sculptural gold-plated cuff bracelet, organic molten form, macro product shot, soft gold reflections |
| `patchwork-tee` | An oversized washed graphic t-shirt covered in sewn-on patches in pink, yellow and blue, flat front view |
| `crt-portrait-print` | A framed editorial print of a person holding a CRT television in front of their face, textured plaster wall, hard flash |

Replace the placeholder images and update `image:` in `src/data/products.ts` from `.svg` to `.webp`. Real photos of the real pieces always beat generated ones once they exist; generated images are for the pitch only.

## Studio scene backdrops (used by the next slice)
Output **16:9, 2560x1440**, no products in frame (empty plinth wall), WebP under 400 KB. Save to `public/scenes/`. Keep them dark and low-contrast: the product must always be the brightest thing on screen.

| File | Prompt (then add the style block) |
| --- | --- |
| `studio-wall.webp` | An empty dark gallery wall of rough plaster, a row of spotlights above, warm red glow from the left edge, concrete floor with a faint reflection |
| `studio-wall-gold.webp` | Same room, warmer: brass wall sconces, patterned cloth hanging at the sides, gold light pooling on the floor |

## Consistency tips
- Generate the whole set in **one session**, reuse a reference image so colour and lighting match.
- Check against the brand sheet: palette near-black, gold/brass, deep red, cream; pops of pink/yellow only on patches.
- Gold must read as gold, not yellow plastic. Regenerate if it looks flat.
- Keep a record of the prompt used per file so the set can be reproduced for a client pitch.
