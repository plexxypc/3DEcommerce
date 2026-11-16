"use client";
import Link from "next/link";
import { useBag } from "@/lib/bag";
import { brand } from "@/brand/adelana";

export function Header() {
  const { count } = useBag();
  return (
    <header className="site">
      <Link href="/" className="wordmark">{brand.name}</Link>
      <nav aria-label="Main">
        <Link href="/shop">Shop</Link>
        <Link href="/bag" aria-label={`Bag, ${count} items`}>Bag ({count})</Link>
      </nav>
    </header>
  );
}
