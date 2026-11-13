"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products } from "@/data/products";

type Line = { slug: string; qty: number };
type BagCtx = { lines: Line[]; count: number; add: (slug: string) => "added" | "max" | "sold"; remove: (slug: string) => void; clear: () => void };
const Ctx = createContext<BagCtx | null>(null);
const KEY = "bag.v1";

export function BagProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setLines(JSON.parse(raw)); } catch {}
  }, []);
  const persist = (next: Line[]) => { setLines(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {} };

  const add = useCallback((slug: string) => {
    const p = products.find((x) => x.slug === slug);
    if (!p || p.stock <= 0) return "sold" as const;
    const cur = lines.find((l) => l.slug === slug)?.qty ?? 0;
    if (cur >= p.stock) return "max" as const; // one-of-one: can't add twice
    persist(cur ? lines.map((l) => (l.slug === slug ? { ...l, qty: cur + 1 } : l)) : [...lines, { slug, qty: 1 }]);
    return "added" as const;
  }, [lines]);

  const value = useMemo<BagCtx>(() => ({
    lines, count: lines.reduce((n, l) => n + l.qty, 0), add,
    remove: (slug) => persist(lines.filter((l) => l.slug !== slug)),
    clear: () => persist([]),
  }), [lines, add]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
export const useBag = () => { const c = useContext(Ctx); if (!c) throw new Error("BagProvider missing"); return c; };
