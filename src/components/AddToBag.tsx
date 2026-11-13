"use client";
import { useState } from "react";
import { useBag } from "@/lib/bag";

export function AddToBag({ slug, stock }: { slug: string; stock: number }) {
  const { add } = useBag();
  const [msg, setMsg] = useState("");
  if (stock <= 0) return <button className="btn" disabled>Sold</button>;
  return (
    <>
      <button className="btn primary" onClick={() => {
        const r = add(slug, stock);
        setMsg(r === "added" ? "Added to bag" : "Already in your bag. This piece is one of one.");
      }}>Add to bag</button>
      <span role="status" className="muted">{msg}</span>
    </>
  );
}
