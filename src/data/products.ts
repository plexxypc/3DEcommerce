// Seed catalogue (placeholders). Live data comes from src/lib/store.ts and the admin page.
// Prices are stored in kobo (minor units) to avoid float errors.
export const categories = ["caps", "footwear", "outerwear", "jewellery", "tees", "denim"] as const;
export type Category = (typeof categories)[number];

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
  { slug: "taxi-patch-cap", name: "Taxi Patch Cap", category: "caps", priceKobo: 6500000, stock: 1, image: "/products/taxi-patch-cap.webp", alt: "Tie-dyed cap covered in embroidered patches including a yellow taxi, a UFO and a Keep Going badge", story: "Tie-dyed, distressed cap built up with embroidered patches.", sizeNote: "One of one. Measurements on request." },
  { slug: "green-bleach-pin-cap", name: "Green Bleach Pin Cap", category: "caps", priceKobo: 5500000, stock: 1, image: "/products/green-bleach-pin-cap.webp", alt: "Green bleach-dyed cap with pins, brooches and a sewn-on patch", story: "Bleach-dyed green cap set with pins and brooches.", sizeNote: "One of one. Measurements on request." },
  { slug: "hand-stitched-runners", name: "Hand-Stitched Runners", category: "footwear", priceKobo: 12000000, stock: 1, image: "/products/hand-stitched-runners.webp", alt: "White running sneakers with black panels hand-stitched in orange and green thread", story: "Sneakers with the panels re-worked in hand stitching and bright laces.", sizeNote: "One of one. Measurements on request." },
  { slug: "charmed-football-boots", name: "Charmed Football Boots", category: "footwear", priceKobo: 9500000, stock: 1, image: "/products/charmed-football-boots.webp", alt: "Black football boots with gold charms hanging from the laces", story: "Black leather boots with gold charms threaded onto the laces.", sizeNote: "One of one. Measurements on request." },
  { slug: "patchwork-rework-jacket", name: "Patchwork Rework Jacket", category: "outerwear", priceKobo: 25000000, stock: 1, image: "/products/patchwork-rework-jacket.webp", alt: "Jacket pieced together from camo vest, plaid shirt and a printed panel", story: "A jacket reconstructed from a camo vest, a check shirt and a printed panel.", sizeNote: "One of one. Measurements on request." },
  { slug: "gilded-fork-sculpture", name: "Gilded Fork Sculpture", category: "jewellery", priceKobo: 15000000, stock: 1, image: "/products/gilded-fork-sculpture.webp", alt: "Gold-toned sculptural piece with charms and red hearts balanced on a fork", story: "Gold-toned sculptural piece dressed with charms, mounted on a fork.", sizeNote: "One of one. Measurements on request." },
  { slug: "reworked-graphic-tee", name: "Reworked Graphic Tee", category: "tees", priceKobo: 4500000, stock: 1, image: "/products/reworked-graphic-tee.webp", alt: "Black graphic t-shirt reworked with a cropped, re-cut hem", story: "Graphic tee cut and re-worked into a new shape.", sizeNote: "One of one. Measurements on request." },
  { slug: "stained-glass-denim", name: "Stained-Glass Patchwork Denim", category: "denim", priceKobo: 11000000, stock: 1, image: "/products/stained-glass-denim.webp", alt: "Light wash jeans with colourful stained-glass style patches", story: "Light denim patched with stained-glass inspired panels.", sizeNote: "One of one. Measurements on request." },
];

