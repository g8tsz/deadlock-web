import { NextResponse } from "next/server";
import { isTurnstileEnforced, verifyTurnstileToken } from "@/lib/turnstile";

export async function assertTurnstileIfConfigured(
  token: string | undefined,
  remoteIp: string,
): Promise<NextResponse | null> {
  if (!isTurnstileEnforced()) return null;
  const t = token?.trim();
  if (!t) {
    return NextResponse.json({ error: "Complete the security check below the form." }, { status: 400 });
  }
  const ok = await verifyTurnstileToken(t, remoteIp);
  if (!ok) {
    return NextResponse.json({ error: "Verification failed. Refresh the page and try again." }, { status: 400 });
  }
  return null;
}
