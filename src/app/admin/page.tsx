import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { listProducts } from "@/lib/store";
import { formatNaira, availability } from "@/lib/money";
import { logout, removeProduct, setSold } from "./actions";

export const dynamic = "force-dynamic";

export default async function Admin() {
  await requireAdmin();
  const items = await listProducts();
  return (
    <>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
        <h1>Pieces ({items.length})</h1>
        <div className="row"><Link className="btn primary" href="/admin/new">Add piece</Link><form action={logout}><button className="btn">Sign out</button></form></div>
      </div>
      <table className="bag">
        <thead><tr><th>Image</th><th>Name</th><th>Price</th><th>Stock</th><th /></tr></thead>
        <tbody>{items.map((p) => (
          <tr key={p.slug}>
            <td><img src={p.image} alt="" width={48} height={60} style={{ objectFit: "cover" }} /></td>
            <td>{p.name}<div className="muted">{p.category}</div></td>
            <td className="price">{formatNaira(p.priceKobo)}</td>
            <td>{availability(p.stock)}</td>
            <td><div className="row">
              <Link className="btn" href={`/admin/${p.slug}`}>Edit</Link>
              {p.stock > 0 && <form action={setSold}><input type="hidden" name="slug" value={p.slug} /><button className="btn">Mark sold</button></form>}
              <form action={removeProduct}><input type="hidden" name="slug" value={p.slug} /><button className="btn">Delete</button></form>
            </div></td>
          </tr>))}</tbody>
      </table>
    </>
  );
}
