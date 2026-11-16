import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "admin_session";
const TTL = 8 * 60 * 60; // seconds

const secret = () => process.env.ADMIN_SESSION_SECRET ?? "";
// Fails closed: with no password/secret configured, nobody is admin.
export const adminConfigured = () => !!process.env.ADMIN_PASSWORD && secret().length >= 16;
const sign = (v: string) => createHmac("sha256", secret()).update(v).digest("hex");
const digest = (v: string) => createHash("sha256").update(v).digest();

export const passwordOk = (input: string) =>
  adminConfigured() && timingSafeEqual(digest(input), digest(process.env.ADMIN_PASSWORD!));

export async function startSession() {
  const exp = String(Math.floor(Date.now() / 1000) + TTL);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: TTL,
  });
}
export async function endSession() { (await cookies()).delete(COOKIE); }

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const [exp, sig] = ((await cookies()).get(COOKIE)?.value ?? "").split(".");
  if (!exp || !sig || Number(exp) < Date.now() / 1000) return false;
  const want = Buffer.from(sign(exp)), got = Buffer.from(sig);
  return want.length === got.length && timingSafeEqual(want, got);
}
export async function requireAdmin() { if (!(await isAdmin())) redirect("/admin/login"); }
