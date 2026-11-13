---
name: 3d-ecommerce-asset-pipeline
description: End-to-end pipeline for turning real products into web-ready 3D models (capture, reconstruction, cleanup, bake, glTF compression, QA, CDN publishing) with size and quality budgets. Use when creating, reviewing, optimising or automating 3D product assets for a web shop, or estimating cost/time of model production.
---

# 3D e-commerce asset pipeline

Rule: **a model that isn't fast is not finished.** Budgets are requirements.

## 0. Decide the capture method per product
| Product type | Best method | Avoid |
| --- | --- | --- |
| Matte, textured (caps, tees, bags, shoes) | Photogrammetry or phone scan (Polycam/Luma/RealityCapture/Meshroom) | |
| Heavily embellished (pins, patches, brooches) | Photogrammetry for form + **hero-detail photos** as hotspot close-ups | Expecting every pin to be modelled |
| Shiny/reflective (gold, chrome, sequins, glass) | Hand-model in Blender from references + PBR metal + env map | Scanning (reflections wreck it) |
| Flat/garments on body | Mannequin/ghost-mannequin turntable; simple cloth model | Full cloth sim |
| Anything that fails 2 attempts | **Image-sequence turntable** (36 to 72 WebP frames) as 3D-lite | Shipping a broken model |

Pilot 3 representative pieces before committing to a catalogue. Measure time and cost per model; that decides scope.

## 1. Capture (photographed items)
- Neutral, even light (or the brand's flash look only for the *beauty* photos, not scan inputs); matte backdrop; no moving items.
- 60 to 120 photos, 3 elevation rings + top + under, ≥ 60% overlap, sharp (f/8+, tripod or turntable), RAW or high-quality JPEG.
- Include a **colour card** and a **scale ruler** in the first frame.
- Shoot detail macros (each hotspot) and 4 to 6 standard photos (front/back/side/detail/worn).
- Naming: `<sku>/raw/IMG_###.jpg`. Keep raw originals in cold storage, never in the app.

## 2. Reconstruct and clean
- Generate mesh + texture; align to Y-up, metres, origin at base-centre, front facing +Z.
- In Blender: remove floaters, fill holes, delete hidden interior geometry, fix normals, merge by distance.
- Set real-world scale (cm) from the ruler; store `height_cm`, `width_cm`, `depth_cm` in product data.

## 3. Optimise geometry and textures
- Retopologise or decimate to **mobile tier ≤ 50k tris** (accessories ≤ 25k); bake normal + AO from the high mesh.
- One material per product where possible (fewer draw calls); max 2.
- Textures: base colour, normal, ORM (occlusion/roughness/metal packed). **2048 px mobile**, 4096 px "detail" tier only for hero pieces.
- Trim UV waste; consistent texel density.
- Metals: metalness 1.0 on bare metal, roughness 0.15 to 0.35; fabrics: metalness 0, roughness 0.6 to 0.9, sheen if needed.

## 4. Export and compress (automate this)
```bash
# glTF-Transform: weld, prune, dedupe, Meshopt geometry, KTX2 (UASTC for normals, ETC1S for colour)
gltf-transform optimize in.glb out.glb \
  --compress meshopt --texture-compress ktx2 --texture-size 2048
```
- Output: `model.mobile.glb`, `model.detail.glb` (optional), `poster.webp` (1200 px), `poster.avif` optional, `meta.json` (dimensions, hotspots, camera defaults).
- Hotspots live in `meta.json`/DB as `{ id, position:[x,y,z], normal:[x,y,z], caption, cameraPose? }`, authored in the admin preview, **not baked into the GLB**.
- Check with `gltf-transform inspect` and `gltf-validator`; CI fails the build over budget.

## 5. Budgets (enforced)
| Item | Mobile | Detail/desktop |
| --- | --- | --- |
| GLB size (compressed) | ≤ 1.5 MB | ≤ 6 MB |
| Triangles | ≤ 50k | ≤ 150k |
| Texture res | 2k | 4k |
| Materials | ≤ 2 | ≤ 3 |
| Poster | ≤ 120 KB | |
| Total scene on first interactive hub | ≤ 4 MB | ≤ 10 MB |

## 6. QA checklist (per model, signed off before publish)
- [ ] Within budgets above (script output attached).
- [ ] Origin at base-centre, correct scale (matches measured cm), upright.
- [ ] No holes/floaters/inverted normals from any orbit angle.
- [ ] Colour matches the reference photos under the shop's lighting (side-by-side screenshot).
- [ ] Metal/gloss reads correctly with the store's environment map.
- [ ] Looks acceptable at lowest quality tier (no shimmering, no z-fighting).
- [ ] Loads and renders on the reference low-end phone at ≥ 30 fps.
- [ ] Poster, alt text, dimensions, hotspots, and SKU metadata filled in.

## 7. Publishing and storage
- Upload to object storage/CDN (e.g. Cloudflare R2) under `/products/<sku>/<version>/…`; **content-hash filenames + `Cache-Control: public, max-age=31536000, immutable`**. New version = new path; never overwrite.
- Serve with correct MIME (`model/gltf-binary`), Brotli not needed for already-compressed GLB; enable CORS for the site origin.
- The DB stores URLs + `meta.json` + checksums, not the files. Never store user/product files inside the deployed app directory.
- Keep source `.blend`/raw captures in separate backup storage.

## 8. Estimating
Track per model: capture min, clean min, optimise min, QA min, fail/redo. Typical planning figures (calibrate after the pilot): simple matte item 2 to 4 h end-to-end; embellished 4 to 8 h; reflective hand-model 8 to 16 h. Multiply catalogue × category average to price the project honestly.

## Anti-patterns
Shipping raw scans (50 MB+); baked-in lighting that fights the scene; unlimited-resolution textures "because it looks good on my laptop"; hotspots baked into mesh; overwriting a published model URL (breaks cache/rollback).
