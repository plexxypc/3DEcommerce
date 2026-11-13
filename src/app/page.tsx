import { StudioShell } from "@/components/StudioShell";
import { products } from "@/data/products";

// Server-rendered: the poster, Enter button and a plain product list are in the
// HTML before any 3D code loads (SEO + no-JS + a11y mirror of the scene).
export default function Home() {
  return (
    <StudioShell products={products}>
      <ul className="sr-only">{products.map((p) => (<li key={p.slug}><a href={`/shop/${p.slug}`}>{p.name}</a></li>))}</ul>
    </StudioShell>
  );
}
