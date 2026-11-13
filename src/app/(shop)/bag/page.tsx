"use client";
import { useBag } from "@/lib/bag";
import { products } from "@/data/products";
import { formatNaira } from "@/lib/money";
import Link from "next/link";

export default function BagPage() {
  const { lines, remove } = useBag();
  const rows = lines.flatMap((l) => { const p = products.find((x) => x.slug === l.slug); return p ? [{ p, qty: l.qty }] : []; });
  const total = rows.reduce((n, r) => n + r.p.priceKobo * r.qty, 0);
  if (!rows.length) return (<><h1>Your bag</h1><p className="muted">Nothing here yet.</p><Link className="btn" href="/shop">Browse the shop</Link></>);
  return (
    <>
      <h1>Your bag</h1>
      <table className="bag">
        <thead><tr><th>Piece</th><th>Qty</th><th>Price</th><th /></tr></thead>
        <tbody>{rows.map(({ p, qty }) => (
          <tr key={p.slug}><td>{p.name}</td><td>{qty}</td><td className="price">{formatNaira(p.priceKobo * qty)}</td>
            <td><button className="btn" onClick={() => remove(p.slug)}>Remove</button></td></tr>))}
        </tbody>
      </table>
      <p className="price" style={{ fontSize: 20 }}>Total {formatNaira(total)}</p>
      {/* Payments land in the next slice: Paystack (NGN) + Stripe (intl), confirmed only via verified webhook. */}
      <button className="btn primary" disabled>Checkout (coming in the payments slice)</button>
    </>
  );
}
