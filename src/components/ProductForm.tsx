"use client";
import { useActionState } from "react";
import { saveProduct } from "@/app/admin/actions";
import { categories, type Product } from "@/data/products";

export function ProductForm({ p }: { p?: Product }) {
  const [state, action, pending] = useActionState(saveProduct, null);
  const v = (k: string, fallback: string | number | undefined) => state?.values?.[k] ?? fallback;
  return (
    <form action={action} className="stack" style={{ maxWidth: 520 }}>
      {p && <input type="hidden" name="slug" value={p.slug} />}
      <label className="stack">Name<input className="field" name="name" required minLength={2} defaultValue={v("name", p?.name)} /></label>
      <label className="stack">Category
        <select className="field" name="category" defaultValue={v("category", p?.category ?? "caps")}>{categories.map((c) => <option key={c}>{c}</option>)}</select>
      </label>
      <div className="row">
        <label className="stack">Price (₦)<input className="field" name="priceNaira" type="number" min={0} step="any" required defaultValue={v("priceNaira", p ? p.priceKobo / 100 : "")} /></label>
        <label className="stack">Stock (1 = one of one, 0 = sold)<input className="field" name="stock" type="number" min={0} step={1} required defaultValue={v("stock", p?.stock ?? 1)} /></label>
      </div>
      <label className="stack">Story<textarea className="field" name="story" rows={3} maxLength={600} defaultValue={v("story", p?.story)} /></label>
      <label className="stack">Size / fit note<input className="field" name="sizeNote" maxLength={120} defaultValue={v("sizeNote", p?.sizeNote)} /></label>
      <label className="stack">Image description (alt text)<input className="field" name="alt" required minLength={3} defaultValue={v("alt", p?.alt)} /></label>
      <label className="stack">Image (JPEG, PNG or WebP, max 5 MB){p && <span className="muted">Leave empty to keep the current image</span>}
        <input className="field" name="image" type="file" accept="image/jpeg,image/png,image/webp" required={!p} />
      </label>
      <button className="btn primary" disabled={pending}>{pending ? "Saving…" : "Save piece"}</button>
      {state?.error && <p role="alert" style={{ color: "var(--accent)" }}>{state.error}</p>}
    </form>
  );
}
