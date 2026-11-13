import { StudioShell } from "@/components/StudioShell";
import { listProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

// Server-rendered: the poster, Enter button and a plain product list are in the
// HTML before any 3D code loads (SEO + no-JS + a11y mirror of the scene).
export default async function Home() {
  const products = await listProducts();
  return (
    <StudioShell products={products}>
      <ul className="sr-only">{products.map((p) => (<li key={p.slug}><a href={`/shop/${p.slug}`}>{p.name}</a></li>))}</ul>
    </StudioShell>
  );
}
