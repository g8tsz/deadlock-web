import { NextResponse } from "next/server";
import { newsletterBodySchema } from "@/lib/schemas/forms";
import { allowFormSubmit } from "@/lib/form-rate-limit";
import { getFormsDiscordWebhookUrl, sendFormToDiscordWebhook } from "@/lib/discord-webhook";
import { getClientIp } from "@/lib/request-ip";
import { assertTurnstileIfConfigured } from "@/lib/forms-guard";
import { logApiError, logApiWarning } from "@/lib/api-log";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!allowFormSubmit(`newsletter:${ip}`)) {
    return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = newsletterBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const turnstileBlock = await assertTurnstileIfConfigured(parsed.data.turnstileToken, ip);
  if (turnstileBlock) return turnstileBlock;

  const { email } = parsed.data;
  const webhookUrl = getFormsDiscordWebhookUrl();

  if (!webhookUrl) {
    if (process.env.NODE_ENV === "development") {
      console.info("[newsletter] (no FORMS_DISCORD_WEBHOOK_URL)", email);
      return NextResponse.json({ ok: true, dev: true });
    }
    logApiWarning("/api/newsletter", "FORMS_DISCORD_WEBHOOK_URL not set");
    return NextResponse.json({ error: "Newsletter signup is not configured on this server." }, { status: 503 });
  }

  const result = await sendFormToDiscordWebhook(webhookUrl, "Website: newsletter signup", [
    { name: "Email", value: email },
  ]);

  if (!result.ok) {
    logApiError("/api/newsletter", "Discord webhook failed", result.error);
    return NextResponse.json({ error: "Could not save signup. Try again later." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
