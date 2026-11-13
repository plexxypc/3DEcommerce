import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProduct, products } from "@/data/products";
import { availability, formatNaira, whatsappLink } from "@/lib/money";
import { brand } from "@/brand/adelana";
import { AddToBag } from "@/components/AddToBag";

type Props = { params: Promise<{ slug: string }> };
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProduct((await params).slug);
  return p ? { title: p.name, description: p.story, openGraph: { images: [p.image] } } : {};
}

export default async function ProductPage({ params }: Props) {
  const p = getProduct((await params).slug);
  if (!p) notFound();
  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.story, image: p.image,
    offers: { "@type": "Offer", priceCurrency: "NGN", price: p.priceKobo / 100, availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/SoldOut" },
  };
  return (
    <div className="product">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <img src={p.image} alt={p.alt} width={800} height={1000} />
      <div className="stack">
        <h1>{p.name}</h1>
        <div className="price" style={{ fontSize: 22 }}>{formatNaira(p.priceKobo)}</div>
        <div className={`badge ${p.stock <= 0 ? "sold" : ""}`}>{availability(p.stock)}</div>
        <p>{p.story}</p>
        <p className="muted">{p.sizeNote}</p>
        <div className="row">
          <AddToBag slug={p.slug} stock={p.stock} />
          <a className="btn" href={whatsappLink(brand.whatsapp, p.name, `/shop/${p.slug}`)}>{p.stock <= 0 ? "Make me one like this" : "Ask on WhatsApp"}</a>
        </div>
      </div>
    </div>
  );
}
