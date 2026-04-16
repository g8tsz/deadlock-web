import { timingSafeEqual } from "node:crypto";

export function verifyIngestSecret(provided: string | null | undefined): boolean {
  const secret = process.env.BOT_INGEST_SECRET?.trim();
  if (!secret || !provided) return false;
  const a = Buffer.from(secret, "utf8");
  const b = Buffer.from(provided, "utf8");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function getBearerToken(authorization: string | null): string | null {
  if (!authorization?.startsWith("Bearer ")) return null;
  return authorization.slice(7).trim() || null;
}
