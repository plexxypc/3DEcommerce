import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { products as seed, type Product } from "@/data/products";

// Catalogue store. Local dev: JSON + files under .data/. Vercel: set BLOB_READ_WRITE_TOKEN
// and it uses Vercel Blob (public). Heavy assets never live in the app directory.
// Prototype caveat: read-modify-write is not atomic; fine for a single admin.
const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const DIR = path.join(process.cwd(), ".data");
const FILE = path.join(DIR, "products.json");
const BLOB_KEY = "catalogue/products.json";

export async function listProducts(): Promise<Product[]> {
  try {
    if (useBlob) {
      const { list } = await import("@vercel/blob");
      const { blobs } = await list({ prefix: BLOB_KEY });
      if (!blobs[0]) return seed;
      return (await (await fetch(blobs[0].url, { cache: "no-store" })).json()) as Product[];
    }
    return JSON.parse(await fs.readFile(FILE, "utf8")) as Product[];
  } catch {
    return seed;
  }
}

async function writeAll(items: Product[]) {
  const body = JSON.stringify(items, null, 2);
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    await put(BLOB_KEY, body, { access: "public", addRandomSuffix: false, allowOverwrite: true, contentType: "application/json" });
  } else {
    await fs.mkdir(DIR, { recursive: true });
    await fs.writeFile(FILE, body);
  }
}

export const getProduct = async (slug: string) => (await listProducts()).find((p) => p.slug === slug);

export async function upsertProduct(p: Product) {
  const all = await listProducts();
  const i = all.findIndex((x) => x.slug === p.slug);
  if (i >= 0) all[i] = p; else all.push(p);
  await writeAll(all);
}

export async function deleteProduct(slug: string) {
  await writeAll((await listProducts()).filter((p) => p.slug !== slug));
}

export async function uniqueSlug(name: string) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "piece";
  const taken = new Set((await listProducts()).map((p) => p.slug));
  let slug = base, n = 2;
  while (taken.has(slug)) slug = `${base}-${n++}`;
  return slug;
}

export async function saveImage(bytes: Buffer, ext: string, contentType: string): Promise<string> {
  const name = `${randomUUID()}.${ext}`;
  if (useBlob) {
    const { put } = await import("@vercel/blob");
    return (await put(`products/${name}`, bytes, { access: "public", contentType })).url;
  }
  await fs.mkdir(path.join(DIR, "uploads"), { recursive: true });
  await fs.writeFile(path.join(DIR, "uploads", name), bytes);
  return `/api/media/${name}`;
}

export async function readLocalImage(name: string) {
  if (!/^[a-f0-9-]{36}\.(jpg|png|webp)$/.test(name)) return null; // no path traversal
  try { return await fs.readFile(path.join(DIR, "uploads", name)); } catch { return null; }
}
