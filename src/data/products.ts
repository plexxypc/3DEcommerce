// PLACEHOLDER catalogue for the prototype. Replaced by DB + admin uploads.
// Prices are stored in kobo (minor units) to avoid float errors.
export type Category = "caps" | "footwear" | "outerwear" | "jewellery" | "tees";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  priceKobo: number;
  stock: number; // 1 = one-of-one
  image: string; // product image (placeholder until real photos land)
  alt: string;
  story: string;
  sizeNote: string;
};

export const products: Product[] = [
  { slug: "brass-brooch-cap", name: "Brass Brooch Cap", category: "caps", priceKobo: 4500000, stock: 1, image: "/products/brass-brooch-cap.svg", alt: "Washed cap covered in vintage brass brooches", story: "A thrifted cap rebuilt with forty hand-sewn vintage brooches.", sizeNote: "Adjustable, fits 56 to 60 cm" },
  { slug: "jewelled-boots", name: "Jewelled Boots", category: "footwear", priceKobo: 18500000, stock: 1, image: "/products/jewelled-boots.svg", alt: "Leather boots covered in charms and rhinestones", story: "Leather boots dressed with charms, chains and rhinestones.", sizeNote: "EU 42" },
  { slug: "pinned-leather-jacket", name: "Pinned Leather Jacket", category: "outerwear", priceKobo: 32000000, stock: 1, image: "/products/pinned-leather-jacket.svg", alt: "Black leather jacket encrusted with enamel pins", story: "A 90s leather jacket carrying 120 enamel pins.", sizeNote: "Size L, chest 112 cm" },
  { slug: "gold-sculpt-cuff", name: "Gold Sculpt Cuff", category: "jewellery", priceKobo: 9500000, stock: 1, image: "/products/gold-sculpt-cuff.svg", alt: "Sculptural gold-plated cuff bracelet", story: "A sculptural gold-plated cuff, cast and hand-finished.", sizeNote: "Fits wrists 14 to 18 cm" },
  { slug: "patchwork-tee", name: "Patchwork Tee", category: "tees", priceKobo: 2800000, stock: 3, image: "/products/patchwork-tee.svg", alt: "Graphic tee with sewn-on patches", story: "Graphic tee remixed with sewn patches. Small run of three.", sizeNote: "Oversized, sizes M to XL" },
  { slug: "crt-portrait-print", name: "CRT Portrait Print", category: "tees", priceKobo: 1500000, stock: 0, image: "/products/crt-portrait-print.svg", alt: "Print of a portrait holding a CRT television", story: "Editorial print. This one has found its home.", sizeNote: "A3, 29.7 x 42 cm" },
];

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
