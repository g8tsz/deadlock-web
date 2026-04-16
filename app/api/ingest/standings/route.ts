import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBearerToken, verifyIngestSecret } from "@/lib/ingest-auth";
import { upsertSchool, upsertTeam } from "@/lib/ingest-helpers";
import { standingsIngestSchema } from "@/lib/schemas/ingest";

export async function POST(request: Request) {
  if (!process.env.BOT_INGEST_SECRET?.trim()) {
    return NextResponse.json({ error: "Ingest not configured" }, { status: 503 });
  }
  const token = getBearerToken(request.headers.get("authorization"));
  if (!verifyIngestSecret(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = standingsIngestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { eventSlug, rows } = parsed.data;
  const event = await prisma.event.findUnique({ where: { slug: eventSlug } });
  if (!event) {
    return NextResponse.json({ error: `Event not found: ${eventSlug}` }, { status: 404 });
  }

  const updated: string[] = [];

  for (const row of rows) {
    const school = await upsertSchool(row.schoolSlug, row.schoolName);
    const team = await upsertTeam(school.id, {
      tag: row.teamTag,
      fullName: row.teamFullName,
      logoUrl: row.teamLogoUrl,
    });

    const existing = await prisma.eventTeam.findFirst({
      where: { eventId: event.id, teamId: team.id },
    });

    const payload = {
      placement: row.placement ?? null,
      score: row.score ?? null,
      seed: row.seed ?? null,
      rankLabel: row.rankLabel ?? null,
      groupName: row.groupName ?? null,
      displayOrder: row.displayOrder ?? null,
    };

    if (existing) {
      await prisma.eventTeam.update({
        where: { id: existing.id },
        data: payload,
      });
    } else {
      await prisma.eventTeam.create({
        data: {
          eventId: event.id,
          teamId: team.id,
          ...payload,
        },
      });
    }
    updated.push(team.id);
  }

  return NextResponse.json({ ok: true, eventId: event.id, teamsUpdated: updated.length });
}
