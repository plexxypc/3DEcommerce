# 3D Ecommerce

A 3D shopping site for the adelana brand. See `docs/PRD.md`.

## Run locally
```bash
npm install
cp .env.example .env.local   # set ADMIN_PASSWORD and ADMIN_SESSION_SECRET (16+ chars)
npm run dev                  # http://localhost:3000, admin at /admin
```
Without `ADMIN_PASSWORD` + `ADMIN_SESSION_SECRET` the admin is disabled (fails closed).

## Catalogue and uploads
Products come from `src/lib/store.ts`: local JSON and image files in `.data/` (gitignored) in dev, **Vercel Blob** when `BLOB_READ_WRITE_TOKEN` is set. Vercel has no writable disk, so the Blob token is required for the admin to persist there. The Blob path is written but untested without a token.

Prototype limits: single shared admin password, no rate limiting on login, non-atomic catalogue writes. Replace with Auth.js and a database before any real client use.
