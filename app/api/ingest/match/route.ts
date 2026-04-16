import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBearerToken, verifyIngestSecret } from "@/lib/ingest-auth";
import { upsertSchool, upsertTeam } from "@/lib/ingest-helpers";
import { matchIngestSchema } from "@/lib/schemas/ingest";
import { assertIngestIpAllowed } from "@/lib/ingest-allowlist";

export async function POST(request: Request) {
  if (!process.env.BOT_INGEST_SECRET?.trim()) {
    return NextResponse.json({ error: "Ingest not configured" }, { status: 503 });
  }
  const token = getBearerToken(request.headers.get("authorization"));
  if (!verifyIngestSecret(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ipBlock = assertIngestIpAllowed(request);
  if (ipBlock) return ipBlock;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = matchIngestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const event = await prisma.event.findUnique({ where: { slug: data.eventSlug } });
  if (!event) {
    return NextResponse.json({ error: `Event not found: ${data.eventSlug}` }, { status: 404 });
  }

  const school1 = await upsertSchool(data.team1.schoolSlug, data.team1.schoolName);
  const school2 = await upsertSchool(data.team2.schoolSlug, data.team2.schoolName);
  const team1 = await upsertTeam(school1.id, {
    tag: data.team1.tag,
    fullName: data.team1.fullName,
    logoUrl: data.team1.logoUrl,
  });
  const team2 = await upsertTeam(school2.id, {
    tag: data.team2.tag,
    fullName: data.team2.fullName,
    logoUrl: data.team2.logoUrl,
  });

  const scheduledAt = new Date(data.scheduledAt);
  const label = data.label ?? null;
  const streamUrl = data.streamUrl || null;
  const vodUrl = data.vodUrl || null;

  const score1 = data.score1 ?? null;
  const score2 = data.score2 ?? null;

  if (data.matchId) {
    const existing = await prisma.match.findFirst({
      where: { id: data.matchId, eventId: event.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Match not found for this event" }, { status: 404 });
    }
    const match = await prisma.match.update({
      where: { id: existing.id },
      data: {
        team1Id: team1.id,
        team2Id: team2.id,
        scheduledAt,
        label,
        score1,
        score2,
        streamUrl,
        vodUrl,
      },
    });
    return NextResponse.json({ ok: true, matchId: match.id });
  }

  const match = await prisma.match.create({
    data: {
      eventId: event.id,
      team1Id: team1.id,
      team2Id: team2.id,
      scheduledAt,
      label,
      score1,
      score2,
      streamUrl,
      vodUrl,
    },
  });
  return NextResponse.json({ ok: true, matchId: match.id });
}
