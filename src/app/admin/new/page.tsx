import { requireAdmin } from "@/lib/auth";
import { ProductForm } from "@/components/ProductForm";
export const dynamic = "force-dynamic";
export default async function NewPiece() { await requireAdmin(); return (<><h1>Add piece</h1><ProductForm /></>); }
