import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  let event: { name: string; description: string | null } | null = null;
  try {
    event = await prisma.event.findUnique({
      where: { slug: params.slug },
      select: { name: true, description: true },
    });
  } catch {
    return { title: "Event" };
  }
  if (!event) {
    return { title: "Event" };
  }
  return {
    title: event.name,
    description:
      event.description?.slice(0, 160) ??
      `${event.name} — College Deadlock collegiate Deadlock esports.`,
  };
}

export default async function EventPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  let event: Awaited<ReturnType<typeof fetchEvent>> = null;
  try {
    event = await fetchEvent(slug);
  } catch {
    // Database unavailable
  }

  if (!event) notFound();

  const byGroup = event.eventTeams.reduce<Record<string, typeof event.eventTeams>>(
    (acc, et) => {
      const g = et.groupName ?? "Standings";
      if (!acc[g]) acc[g] = [];
      acc[g].push(et);
      return acc;
    },
    {}
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link href="/events" className="text-sm text-deadlock-muted hover:text-deadlock-gold mb-6 inline-block">
        ← Events
      </Link>
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          {event.name}
          {event.isCurrent && (
            <span className="ml-2 rounded bg-deadlock-gold/20 px-2 py-0.5 text-sm text-deadlock-gold">
              Current
            </span>
          )}
        </h1>
        <p className="text-deadlock-muted mt-2">
          {event.type && `${event.type} · `}
          {event.startDate
            ? new Date(event.startDate).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Date TBD"}
        </p>
        {event.description && (
          <p className="text-deadlock-muted mt-4 max-w-2xl">{event.description}</p>
        )}
        {(event.streamUrl || event.vodUrl) && (
          <div className="mt-4 flex gap-4">
            {event.streamUrl && (
              <a
                href={event.streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-deadlock-gold hover:text-deadlock-gold-light text-sm"
              >
                Stream
              </a>
            )}
            {event.vodUrl && (
              <a
                href={event.vodUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-deadlock-gold hover:text-deadlock-gold-light text-sm"
              >
                VOD
              </a>
            )}
          </div>
        )}
      </header>

      <div className="space-y-10">
        {Object.entries(byGroup).map(([groupName, teams]) => (
          <div key={groupName}>
            <h2 className="text-lg font-semibold text-white mb-4">{groupName}</h2>
            <div className="rounded-lg border border-deadlock-brown bg-deadlock-card overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-deadlock-brown text-deadlock-muted bg-deadlock-surface/50">
                    <th className="p-4">#</th>
                    <th className="p-4">Team</th>
                    <th className="p-4">School</th>
                    <th className="p-4">Seed / Rank</th>
                    <th className="p-4">Captains</th>
                    <th className="p-4">Staff</th>
                  </tr>
                </thead>
                <tbody>
                  {teams.map((et, i) => (
                    <tr key={et.id} className="border-b border-deadlock-brown/50 last:border-0">
                      <td className="p-4 text-deadlock-muted">{et.placement ?? i + 1}</td>
                      <td className="p-4">
                        <span className="font-medium text-white">{et.team.tag}</span>
                        <span className="text-deadlock-muted ml-1">— {et.team.fullName}</span>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/schools/${et.team.school.slug}`}
                          className="text-deadlock-muted hover:text-deadlock-gold"
                        >
                          {et.team.school.name}
                        </Link>
                      </td>
                      <td className="p-4 text-deadlock-muted">
                        {et.rankLabel ?? (et.seed != null ? String(et.seed) : "—")}
                      </td>
                      <td className="p-4 text-deadlock-muted">
                        {et.team.captains.map((c) => c.discordUsername).join(", ")}
                      </td>
                      <td className="p-4 text-deadlock-muted">
                        {et.team.staff.length
                          ? et.team.staff.map((s) => s.discordUsername).join(", ")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function fetchEvent(slug: string) {
  return prisma.event.findUnique({
    where: { slug },
    include: {
      eventTeams: {
        include: {
          team: {
            include: {
              school: true,
              captains: true,
              staff: true,
            },
          },
        },
        orderBy: [{ groupName: "asc" }, { placement: "asc" }, { score: "desc" }],
      },
    },
  });
}
