"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { endSession, isAdmin, passwordOk, startSession } from "@/lib/auth";
import { deleteProduct, getProduct, saveImage, uniqueSlug, upsertProduct } from "@/lib/store";
import { categories, type Product } from "@/data/products";

const MAX_BYTES = 5 * 1024 * 1024;

// Sniff the real type from magic bytes; never trust the client's filename or MIME.
function sniff(b: Buffer): { ext: string; type: string } | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return { ext: "jpg", type: "image/jpeg" };
  if (b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { ext: "png", type: "image/png" };
  if (b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP") return { ext: "webp", type: "image/webp" };
  return null;
}

export async function login(_: unknown, fd: FormData) {
  if (!passwordOk(String(fd.get("password") ?? ""))) return { error: "Wrong password, or admin is not configured." };
  await startSession();
  redirect("/admin");
}
export async function logout() { await endSession(); redirect("/admin/login"); }

const Form = z.object({
  name: z.string().trim().min(2).max(80),
  category: z.enum(categories),
  priceNaira: z.coerce.number().min(0).max(100_000_000),
  stock: z.coerce.number().int().min(0).max(999),
  story: z.string().trim().max(600),
  sizeNote: z.string().trim().max(120),
  alt: z.string().trim().min(3).max(160),
});

type FormState = { error: string; values?: Record<string, string> } | null;

export async function saveProduct(_: FormState, fd: FormData): Promise<FormState> {
  // React 19 resets the form after an action, so echo text fields back on errors.
  const values = Object.fromEntries([...fd].filter(([k, v]) => typeof v === "string" && !k.startsWith("$"))) as Record<string, string>;
  const fail = (error: string): FormState => ({ error, values });
  if (!(await isAdmin())) return fail("Not signed in."); // actions are public endpoints: re-check
  const parsed = Form.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return fail(parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; "));
  const slugIn = String(fd.get("slug") ?? "");
  const existing = slugIn ? await getProduct(slugIn) : undefined;
  if (slugIn && !existing) return fail("Piece not found.");

  let image = existing?.image ?? "";
  const file = fd.get("image");
  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_BYTES) return fail("Image is over 5 MB. Choose the image again.");
    const buf = Buffer.from(await file.arrayBuffer());
    const kind = sniff(buf);
    if (!kind) return fail("Image must be a JPEG, PNG or WebP. Choose the image again.");
    image = await saveImage(buf, kind.ext, kind.type);
  }
  if (!image) return fail("Please upload an image.");

  const d = parsed.data;
  const p: Product = {
    slug: existing?.slug ?? (await uniqueSlug(d.name)), name: d.name, category: d.category,
    priceKobo: Math.round(d.priceNaira * 100), stock: d.stock, image, alt: d.alt, story: d.story, sizeNote: d.sizeNote,
  };
  await upsertProduct(p);
  for (const path of ["/", "/shop", `/shop/${p.slug}`]) revalidatePath(path);
  redirect("/admin");
}

export async function setSold(fd: FormData) {
  if (!(await isAdmin())) return;
  const p = await getProduct(String(fd.get("slug")));
  if (p) { await upsertProduct({ ...p, stock: 0 }); revalidatePath("/shop"); revalidatePath("/"); revalidatePath("/admin"); }
}
export async function removeProduct(fd: FormData) {
  if (!(await isAdmin())) return;
  await deleteProduct(String(fd.get("slug")));
  revalidatePath("/shop"); revalidatePath("/"); revalidatePath("/admin");
}
