"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";
import { brand } from "@/brand/adelana";
import { detectTier, type Tier } from "@/lib/capability";
import { availability, formatNaira, whatsappLink } from "@/lib/money";
import { AddToBag } from "@/components/AddToBag";
import { useBag } from "@/lib/bag";

// Three.js is only fetched after Enter; non-3D routes never ship it.
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false });

export function StudioShell({ products, children }: { products: Product[]; children?: ReactNode }) {
  const [tier, setTier] = useState<Tier | null>(null);
  const [entered, setEntered] = useState(false);
  const [ready, setReady] = useState(false);
  const [index, setIndex] = useState(0);
  const [focus, setFocus] = useState<string | null>(null);
  const { count } = useBag();

  useEffect(() => { setTier(detectTier().tier); }, []);

  // URL mirrors state: /?piece=slug (back button + share links work)
  useEffect(() => {
    const read = () => {
      const slug = new URLSearchParams(location.search).get("piece");
      const i = products.findIndex((p) => p.slug === slug);
      if (i >= 0) { setIndex(i); setFocus(slug); setEntered(true); } else setFocus(null);
    };
    read(); addEventListener("popstate", read); return () => removeEventListener("popstate", read);
  }, [products]);

  const openPiece = useCallback((slug: string | null) => {
    setFocus(slug);
    const url = slug ? `/?piece=${slug}` : "/";
    if (location.pathname + location.search !== url) history.pushState(null, "", url);
  }, []);
  const step = useCallback((d: number) => setIndex((i) => Math.min(products.length - 1, Math.max(0, i + d))), [products.length]);

  useEffect(() => {
    if (!entered) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") openPiece(null);
      else if (!focus && e.key === "ArrowRight") step(1);
      else if (!focus && e.key === "ArrowLeft") step(-1);
    };
    let lock = 0;
    const wheel = (e: WheelEvent) => { if (focus || Date.now() - lock < 450 || Math.abs(e.deltaY + e.deltaX) < 20) return; lock = Date.now(); step(e.deltaY + e.deltaX > 0 ? 1 : -1); };
    let x0 = 0;
    const ts = (e: TouchEvent) => { x0 = e.touches[0].clientX; };
    const te = (e: TouchEvent) => { if (focus) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); };
    addEventListener("keydown", key); addEventListener("wheel", wheel, { passive: true });
    addEventListener("touchstart", ts, { passive: true }); addEventListener("touchend", te, { passive: true });
    return () => { removeEventListener("keydown", key); removeEventListener("wheel", wheel); removeEventListener("touchstart", ts); removeEventListener("touchend", te); };
  }, [entered, focus, step, openPiece]);

  const canUse3d = tier === "mid" || tier === "high" || tier === "low";
  const [forced, setForced] = useState(false);
  const show3d = entered && (canUse3d || forced);
  const p = products.find((x) => x.slug === focus) ?? null;

  return (
    <div className="studio">
      {show3d && <Scene products={products} index={index} focus={focus} tier={tier ?? "mid"} onFocus={openPiece} onReady={() => setReady(true)} />}
      {children}
      {show3d && (
        <>
          <div className="studio-top">
            <Link href="/shop" className="btn">Skip to shop (2D)</Link>
            <Link href="/bag" className="btn">Bag ({count})</Link>
          </div>
          {!focus && (
            <>
              <div className="zone" aria-live="polite">{products[index].name}</div>
              <div className="studio-nav">
                <button className="btn" onClick={() => step(-1)} disabled={index === 0} aria-label="Previous piece">←</button>
                <button className="btn primary" onClick={() => openPiece(products[index].slug)}>View piece</button>
                <button className="btn" onClick={() => step(1)} disabled={index === products.length - 1} aria-label="Next piece">→</button>
              </div>
            </>
          )}
        </>
      )}
      {p && show3d && (
        <aside className="sheet" aria-label={`Viewing ${p.name}`}>
          <div role="status" className="sr-only">{`Viewing: ${p.name}, ${formatNaira(p.priceKobo)}, ${availability(p.stock)}`}</div>
          <h2>{p.name}</h2>
          <div className="price" style={{ fontSize: 20 }}>{formatNaira(p.priceKobo)}</div>
          <div className={`badge ${p.stock <= 0 ? "sold" : ""}`}>{availability(p.stock)}</div>
          <p className="muted" style={{ margin: 0 }}>{p.sizeNote}</p>
          <div className="row"><AddToBag slug={p.slug} stock={p.stock} /></div>
          <div className="row">
            <a className="btn" href={whatsappLink(brand.whatsapp, p.name, `${location.origin}/shop/${p.slug}`)}>{p.stock <= 0 ? "Make me one like this" : "Ask on WhatsApp"}</a>
            <Link className="btn" href={`/shop/${p.slug}`}>Full page</Link>
            <button className="btn" onClick={() => openPiece(null)}>Close</button>
          </div>
        </aside>
      )}
      {!(show3d && ready) && (
        <div className="poster">
          <h1>{brand.name}</h1>
          <p className="muted">{brand.tagline}</p>
          {!entered && tier === null && (<><p className="muted">Checking your device…</p><Link href="/shop" className="btn">Skip to shop</Link></>)}
          {!entered && tier !== null && (canUse3d || tier === "data-saver") && (
            <div className="row" style={{ justifyContent: "center" }}>
              <button className="btn primary" onClick={() => { setEntered(true); if (tier === "data-saver") setForced(true); }}>
                {tier === "data-saver" ? "Load 3D Studio (uses data)" : "Enter the Studio"}
              </button>
              <Link href="/shop" className="btn">Skip to shop</Link>
            </div>
          )}
          {tier === "fallback" && (<><p className="muted">Showing the simple shop on this device.</p><Link href="/shop" className="btn primary">Open the shop</Link></>)}
          {entered && show3d && !ready && (<div role="status"><div className="loadbar"><i style={{ width: "60%" }} /></div><p className="muted">Loading the studio…</p></div>)}
        </div>
      )}
    </div>
  );
}
