import Link from "next/link";
import type { Metadata } from "next";
import { products } from "@/data/products";
import { availability, formatNaira } from "@/lib/money";

export const metadata: Metadata = { title: "Shop" };

export default function Shop() {
  return (
    <>
      <h1>Shop</h1>
      <p className="muted">Each piece is hand-embellished. Most are one of one.</p>
      <ul className="grid">
        {products.map((p) => (
          <li key={p.slug}>
            <Link href={`/shop/${p.slug}`} className={`card ${p.stock <= 0 ? "sold" : ""}`}>
              <img src={p.image} alt={p.alt} width={800} height={1000} loading="lazy" />
              <div>
                <h2 style={{ fontSize: 18 }}>{p.name}</h2>
                <div className="price">{formatNaira(p.priceKobo)}</div>
                <div className={`badge ${p.stock <= 0 ? "sold" : ""}`}>{availability(p.stock)}</div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/" className="btn">Enter the 3D Studio</Link>
    </>
  );
}
