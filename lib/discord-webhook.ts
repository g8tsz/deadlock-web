/** College Deadlock gold #c9a227 */
const EMBED_COLOR = 0xc9a227;

function isDiscordWebhookUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && u.hostname === "discord.com" && u.pathname.startsWith("/api/webhooks/");
  } catch {
    return false;
  }
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s;
  return `${s.slice(0, max - 1)}…`;
}

export async function sendFormToDiscordWebhook(
  webhookUrl: string,
  title: string,
  fields: { name: string; value: string }[],
): Promise<{ ok: boolean; status: number; error?: string }> {
  if (!isDiscordWebhookUrl(webhookUrl)) {
    return { ok: false, status: 500, error: "Invalid webhook configuration" };
  }

  const body = JSON.stringify({
    embeds: [
      {
        title: truncate(title, 256),
        color: EMBED_COLOR,
        fields: fields.map((f) => ({
          name: truncate(f.name, 256),
          value: truncate(f.value, 1024),
        })),
        timestamp: new Date().toISOString(),
      },
    ],
  });

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, status: res.status, error: text.slice(0, 200) };
  }
  return { ok: true, status: res.status };
}

export function getFormsDiscordWebhookUrl(): string | null {
  const url = process.env.FORMS_DISCORD_WEBHOOK_URL?.trim();
  if (url) return url;
  return null;
}
