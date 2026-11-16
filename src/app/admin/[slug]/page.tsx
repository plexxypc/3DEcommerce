import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { getProduct } from "@/lib/store";
import { ProductForm } from "@/components/ProductForm";
export const dynamic = "force-dynamic";
export default async function EditPiece({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  return (<><h1>Edit {p.name}</h1><ProductForm p={p} /></>);
}
