import { readLocalImage } from "@/lib/store";
const types: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };
// Local-dev image serving only; on Vercel images are Blob URLs.
export async function GET(_: Request, { params }: { params: Promise<{ name: string }> }) {
  const name = (await params).name;
  const buf = await readLocalImage(name);
  if (!buf) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(buf), { headers: { "content-type": types[name.split(".").pop()!], "cache-control": "public, max-age=31536000, immutable", "x-content-type-options": "nosniff" } });
}
