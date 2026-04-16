import { NextResponse } from "next/server";
import { getClientIp } from "@/lib/request-ip";

/**
 * Optional comma-separated allowlist of client IPs for ingest routes.
 * Set `BOT_INGEST_ALLOWED_IPS` (e.g. `1.2.3.4,5.6.7.8`). If unset, all IPs are allowed after bearer auth.
 */
export function assertIngestIpAllowed(request: Request): NextResponse | null {
  const raw = process.env.BOT_INGEST_ALLOWED_IPS?.trim();
  if (!raw) return null;

  const ip = getClientIp(request);
  const allowed = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  if (allowed.includes("*")) return null;
  if (allowed.includes(ip)) return null;

  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
