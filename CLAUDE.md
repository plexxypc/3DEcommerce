# 3D Ecommerce (adelana store)

A 3D shopping experience for the adelana brand (hand-embellished, one-of-one fashion, Lagos). Visitors explore a 3D "Studio", inspect pieces, and buy in naira.

Read first: `docs/PRD.md` (goals, requirements, open questions). Sections tagged [ASSUMED] are unconfirmed; the owner's reference videos have not been reviewed yet.

## Design skills (also reusable on other 3D shops)
`.claude/skills/3d-ecommerce-*`: art direction, motion and interaction, asset pipeline, performance and fallbacks. Follow them for all scene, UI and asset work.

## Non-negotiables
- 3D is progressive enhancement: a full non-3D shop (grid, product page, bag, checkout) must always work.
- Checkout and forms are plain HTML, never inside the canvas.
- Mobile budgets in the PRD (Section 8) and asset skill are requirements; test on a low-end Android.
- Secrets only in environment variables; never commit `.env` files.
- Heavy assets live on object storage/CDN, never in the app directory.
- One-of-one stock: reserve on checkout, confirm only after the Paystack webhook.
