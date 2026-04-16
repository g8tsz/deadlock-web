import { NextResponse } from "next/server";
import { contactBodySchema } from "@/lib/schemas/forms";
import { allowFormSubmit } from "@/lib/form-rate-limit";
import { getFormsDiscordWebhookUrl, sendFormToDiscordWebhook } from "@/lib/discord-webhook";
import { getClientIp } from "@/lib/request-ip";

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
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const webhookUrl = getFormsDiscordWebhookUrl();

  if (!webhookUrl) {
    if (process.env.NODE_ENV === "development") {
      console.info("[contact] (no FORMS_DISCORD_WEBHOOK_URL)", data);
      return NextResponse.json({ ok: true, dev: true });
    }
    return NextResponse.json({ error: "Contact form is not configured on this server." }, { status: 503 });
  }

  const result = await sendFormToDiscordWebhook(
    webhookUrl,
    "Website: contact form",
    [
      { name: "Name", value: data.name },
      { name: "Email", value: data.email },
      ...(data.company ? [{ name: "Company / school", value: data.company }] : []),
      { name: "Message", value: data.message },
    ],
  );

  if (!result.ok) {
    return NextResponse.json({ error: "Could not deliver message. Try Discord or email later." }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
