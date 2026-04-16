import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Schedule",
  description: "Deadlock Collegiate Series match schedule — times, teams, and stream links.",
};

async function fetchSchedule() {
  return Promise.all([
    prisma.match.findMany({
      orderBy: { scheduledAt: "asc" },
      include: {
        event: true,
        team1: { include: { school: true } },
        team2: { include: { school: true } },
      },
    }),
    prisma.event.findMany({
      orderBy: { startDate: "desc" },
      include: { _count: { select: { matches: true } } },
    }),
  ]);
}

export default async function SchedulePage() {
  let matches: Awaited<ReturnType<typeof fetchSchedule>>[0] = [];
  let events: Awaited<ReturnType<typeof fetchSchedule>>[1] = [];
  try {
    [matches, events] = await fetchSchedule();
  } catch (_err) {
    // DB unavailable
  }

  const formatMatchTime = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" }) +
    " · " +
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Schedule</h1>
      <p className="text-deadlock-muted mb-4">
        Upcoming matches for the Deadlock Collegiate Series.
      </p>
      <p className="text-deadlock-muted text-sm mb-10">
        Sign up for matches and teams via{" "}
        <a
          href="https://discord.gg/college-deadlock"
          target="_blank"
          rel="noopener noreferrer"
          className="text-deadlock-gold hover:text-deadlock-gold-light font-semibold"
        >
          Discord
        </a>
        .
      </p>

      {matches.length > 0 ? (
        <div className="space-y-6">
          {matches.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-deadlock-brown bg-deadlock-card p-6 flex flex-wrap items-center justify-between gap-6 [clip-path:polygon(0_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%)]"
            >
              <div className="flex-1 min-w-[200px]">
                <p className="text-xs font-semibold text-deadlock-gold uppercase tracking-wider">
                  {m.event.name} {m.label && `· ${m.label}`}
                </p>
                <p className="text-deadlock-muted mt-1">{formatMatchTime(m.scheduledAt)}</p>
                <p className="text-deadlock-muted text-sm mt-1">Best of 3</p>
              </div>
              <div className="flex items-center gap-8 flex-wrap">
                <div className="text-center min-w-[100px]">
                  <p className="font-semibold text-white">{m.team1.tag}</p>
                  <p className="text-sm text-deadlock-muted">{m.team1.school.name}</p>
                </div>
                <div className="font-mono text-2xl text-deadlock-muted">
                  {m.score1 != null && m.score2 != null ? `${m.score1} : ${m.score2}` : "VS"}
                </div>
                <div className="text-center min-w-[100px]">
                  <p className="font-semibold text-white">{m.team2.tag}</p>
                  <p className="text-sm text-deadlock-muted">{m.team2.school.name}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {m.streamUrl && (
                  <a
                    href={m.streamUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-deadlock-gold hover:text-deadlock-gold-light text-sm font-semibold"
                  >
                    Watch live
                  </a>
                )}
                {m.vodUrl && (
                  <a
                    href={m.vodUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-deadlock-gold hover:text-deadlock-gold-light text-sm font-semibold"
                  >
                    VOD
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-deadlock-muted">No matches scheduled yet. Check back soon.</p>
      )}

      <section className="mt-16">
        <h2 className="text-xl font-bold text-white mb-6">Events</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {events.map((e) => (
            <Link
              key={e.id}
              href={`/events/${e.slug}`}
              className="rounded-lg border border-deadlock-brown bg-deadlock-card p-6 hover:border-deadlock-gold/30 transition"
            >
              <h3 className="font-semibold text-white">{e.name}</h3>
              <p className="text-sm text-deadlock-muted mt-1">
                {e.startDate
                  ? new Date(e.startDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                  : "Date TBD"}
              </p>
              {e._count.matches > 0 && (
                <p className="text-sm text-deadlock-muted mt-1">{e._count.matches} match{e._count.matches !== 1 ? "es" : ""}</p>
              )}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
