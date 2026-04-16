import { NextResponse } from "next/server";
import { contactBodySchema } from "@/lib/schemas/forms";
import { allowFormSubmit } from "@/lib/form-rate-limit";
import { getFormsDiscordWebhookUrl, sendFormToDiscordWebhook } from "@/lib/discord-webhook";
import { getClientIp } from "@/lib/request-ip";
import { assertTurnstileIfConfigured } from "@/lib/forms-guard";
import { logApiError, logApiWarning } from "@/lib/api-log";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!allowFormSubmit(`contact:${ip}`)) {
    return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const turnstileBlock = await assertTurnstileIfConfigured(parsed.data.turnstileToken, ip);
  if (turnstileBlock) return turnstileBlock;

  const { name, email, message, company } = parsed.data;
  const webhookUrl = getFormsDiscordWebhookUrl();

  if (!webhookUrl) {
    if (process.env.NODE_ENV === "development") {
      console.info("[contact] (no FORMS_DISCORD_WEBHOOK_URL)", { name, email, company, message });
      return NextResponse.json({ ok: true, dev: true });
    }
    logApiWarning("/api/contact", "FORMS_DISCORD_WEBHOOK_URL not set");
    return NextResponse.json({ error: "Contact form is not configured on this server." }, { status: 503 });
  }

  const result = await sendFormToDiscordWebhook(
    webhookUrl,
    "Website: contact form",
    [
      { name: "Name", value: name },
      { name: "Email", value: email },
      ...(company ? [{ name: "Company / school", value: company }] : []),
      { name: "Message", value: message },
    ],
  );

  if (!result.ok) {
    logApiError("/api/contact", "Discord webhook failed", result.error);
    return NextResponse.json({ error: "Could not deliver message. Try Discord or email later." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
