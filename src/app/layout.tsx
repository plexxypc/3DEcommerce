import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BagProvider } from "@/lib/bag";
import { brand } from "@/brand/adelana";

export const metadata: Metadata = { title: { default: `${brand.name} Studio`, template: `%s · ${brand.name}` }, description: brand.tagline };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0B0B0C" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en"><body><BagProvider>{children}</BagProvider></body></html>
  );
}
