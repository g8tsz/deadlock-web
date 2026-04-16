import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Deadlock Collegiate Series — premier collegiate esports for Deadlock. Schedules, standings, and North American university competition.",
  openGraph: {
    title: "College Deadlock | Deadlock Collegiate Series",
    description:
      "Join the Deadlock Collegiate Series: top schools, live matches, and a community-first collegiate league.",
    url: getSiteUrl(),
  },
};

function getThisWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const start = new Date(now);
  start.setDate(now.getDate() - day);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return { start, end };
}

function TeamLogo({ team, school }: { team: { tag: string; logoUrl?: string | null }; school: { name: string } }) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-10 w-10 shrink-0 rounded-lg bg-deadlock-surface border border-deadlock-brown flex items-center justify-center overflow-hidden">
        {team.logoUrl ? (
          <img src={team.logoUrl} alt="" width={40} height={40} className="h-full w-full object-contain" />
        ) : (
          <span className="text-deadlock-gold font-bold text-sm">{team.tag.slice(0, 2)}</span>
        )}
      </div>
      <p className="mt-1 font-semibold text-white text-xs">{team.tag}</p>
      <p className="text-[10px] text-deadlock-muted max-w-[80px] truncate text-center">{school.name}</p>
    </div>
  );
}

type MatchWithTeams = Awaited<ReturnType<typeof fetchMatchesThisWeek>>;

function fetchMatchesThisWeek() {
  const { start, end } = getThisWeekRange();
  return prisma.match.findMany({
    where: { scheduledAt: { gte: start, lte: end } },
    orderBy: { scheduledAt: "asc" },
    include: {
      event: true,
      team1: { include: { school: true } },
      team2: { include: { school: true } },
    },
  });
}

type StandingRow = {
  id: string;
  placement: number | null;
  score: number | null;
  seed: number | null;
  rankLabel: string | null;
  groupName: string | null;
  team: { tag: string; fullName: string; school: { name: string; slug: string } };
};

async function fetchCurrentStandings(): Promise<{
  eventName: string;
  slug: string;
  groups: Record<string, StandingRow[]>;
} | null> {
  let event = await prisma.event.findFirst({
    where: { isCurrent: true },
    include: {
      eventTeams: {
        include: {
          team: { include: { school: true } },
        },
      },
    },
  });
  if (!event || event.eventTeams.length === 0) {
    event = await prisma.event.findFirst({
      where: { eventTeams: { some: {} } },
      orderBy: { startDate: "desc" },
      include: {
        eventTeams: {
          include: {
            team: { include: { school: true } },
          },
        },
      },
    });
  }
  if (!event || event.eventTeams.length === 0) return null;

  const groups: Record<string, StandingRow[]> = {};
  for (const et of event.eventTeams) {
    const g = et.groupName ?? "Standings";
    if (!groups[g]) groups[g] = [];
    groups[g].push({
      id: et.id,
      placement: et.placement,
      score: et.score,
      seed: et.seed,
      rankLabel: et.rankLabel,
      groupName: et.groupName,
      team: et.team,
    });
  }
  for (const key of Object.keys(groups)) {
    groups[key].sort((a, b) => (a.placement ?? 999) - (b.placement ?? 999));
  }

  return { eventName: event.name, slug: event.slug, groups };
}

export default async function HomePage() {
  let matchesThisWeek: MatchWithTeams = [];
  let standings: Awaited<ReturnType<typeof fetchCurrentStandings>> = null;
  try {
    [matchesThisWeek, standings] = await Promise.all([fetchMatchesThisWeek(), fetchCurrentStandings()]);
  } catch (_err) {
    // DB unavailable
  }

  const formatMatchDate = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const formatMatchTime = (d: Date) =>
    d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  const displayMatches = matchesThisWeek.slice(0, 6);
  const hasMoreMatches = matchesThisWeek.length > 6;
  const groupKeys = standings ? Object.keys(standings.groups).sort() : [];

  return (
    <div className="bg-deadlock-dark min-h-[calc(100vh-4rem)] flex flex-col">
      <section className="flex-1 flex flex-col justify-center px-4 py-8 border-b border-deadlock-brown relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(201,162,39,0.14),transparent_55%)] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-deadlock-gold/[0.03] via-transparent to-deadlock-dark pointer-events-none" />
        <div className="absolute inset-x-0 top-6 flex justify-center pointer-events-none overflow-hidden select-none">
          <span
            className="text-[min(16vw,9rem)] font-black uppercase leading-none tracking-tight text-deadlock-brown/20 whitespace-nowrap"
            aria-hidden
          >
            Collegiate Deadlock
          </span>
        </div>

        <div className="mx-auto max-w-4xl w-full text-center relative z-[1]">
          <p className="section-label">College Deadlock</p>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mt-2">
            Introducing the Deadlock Collegiate Series.
          </h1>
          <div className="w-20 h-0.5 bg-deadlock-gold mx-auto mt-3 rounded-full" />
          <p className="mt-4 text-deadlock-muted max-w-2xl mx-auto text-sm leading-relaxed">
            Join the Deadlock Collegiate Series, the premier collegiate esports tournament featuring top schools from
            across North America. We&apos;re revolutionizing the collegiate esports scene by bringing competitive
            Deadlock gameplay to the next level. Be part of the movement to redefine collegiate esports forever in the
            Deadlock Collegiate Series!
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="rounded-lg bg-deadlock-gold px-6 py-2.5 text-sm font-semibold text-deadlock-dark hover:bg-deadlock-gold-light hover:shadow-md hover:shadow-deadlock-gold/25 hover:-translate-y-0.5 transition duration-200 ring-2 ring-deadlock-gold/40 ring-offset-2 ring-offset-deadlock-dark"
            >
              Join Now
            </Link>
            <a
              href="https://discord.gg/college-deadlock"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-[#5865F2]/60 bg-[#5865F2]/15 px-6 py-2.5 text-sm font-semibold text-[#dbeafe] hover:bg-[#5865F2]/25 transition duration-200"
            >
              Join Discord
            </a>
          </div>
        </div>

        {/* Upcoming matches this week */}
        <div className="mx-auto max-w-5xl w-full mt-10 relative z-[1]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-deadlock-gold mb-4">
            Upcoming matches this week
          </h2>
          {matchesThisWeek.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {displayMatches.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl border border-deadlock-brown bg-deadlock-card p-4 hover:border-deadlock-gold/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-deadlock-gold/10 transition duration-200 [clip-path:polygon(0_0,100%_0,100%_calc(100%-14px),calc(100%-14px)_100%,0_100%)]"
                >
                  <p className="text-xs text-deadlock-gold font-semibold uppercase">
                    {m.event.name} {m.label && `· ${m.label}`}
                  </p>
                  <p className="text-deadlock-muted text-xs mt-1">
                    {formatMatchDate(m.scheduledAt)} · {formatMatchTime(m.scheduledAt)}
                  </p>
                  <div className="flex items-center justify-between gap-2 mt-3">
                    <TeamLogo team={m.team1} school={m.team1.school} />
                    <span className="text-deadlock-gold font-mono text-sm font-semibold">
                      {m.score1 != null && m.score2 != null ? `${m.score1}:${m.score2}` : "VS"}
                    </span>
                    <TeamLogo team={m.team2} school={m.team2.school} />
                  </div>
                  {(m.streamUrl || m.vodUrl) && (
                    <div className="mt-3 flex flex-wrap gap-3 text-xs">
                      {m.streamUrl && (
                        <a
                          href={m.streamUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-deadlock-gold hover:text-deadlock-gold-light font-medium"
                        >
                          Watch live
                        </a>
                      )}
                      {m.vodUrl && (
                        <a
                          href={m.vodUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-deadlock-gold hover:text-deadlock-gold-light font-medium"
                        >
                          VOD
                        </a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-deadlock-muted text-sm">No matches this week. Check the full schedule.</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-4">
            {hasMoreMatches && (
              <span className="text-deadlock-muted text-xs">Showing 6 of {matchesThisWeek.length} this week · </span>
            )}
            <Link href="/schedule" className="text-deadlock-gold hover:text-deadlock-gold-light text-sm font-semibold">
              View full schedule →
            </Link>
            <span className="text-deadlock-muted text-xs">Sign up for matches via</span>
            <a
              href="https://discord.gg/college-deadlock"
              target="_blank"
              rel="noopener noreferrer"
              className="text-deadlock-gold hover:text-deadlock-gold-light text-sm font-semibold"
            >
              Discord
            </a>
          </div>
        </div>

        {/* Current standings */}
        {standings && groupKeys.length > 0 && (
          <div className="mx-auto max-w-5xl w-full mt-12 relative z-[1]">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-deadlock-gold">
                Current standings · {standings.eventName}
              </h2>
              <Link
                href={`/events/${standings.slug}`}
                className="text-sm font-semibold text-deadlock-gold hover:text-deadlock-gold-light"
              >
                Full event →
              </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {groupKeys.map((groupName) => (
                <div key={groupName} className="rounded-xl border border-deadlock-brown bg-deadlock-card/80 overflow-hidden">
                  <div className="bg-deadlock-gold/15 px-4 py-2 border-b border-deadlock-brown">
                    <h3 className="text-sm font-bold text-deadlock-cream uppercase tracking-wide">{groupName}</h3>
                  </div>
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-deadlock-muted border-b border-deadlock-brown/60">
                        <th className="p-3 pl-4 w-10">#</th>
                        <th className="p-3">Team</th>
                        <th className="p-3">Score</th>
                        <th className="p-3 pr-4">Seed / rank</th>
                      </tr>
                    </thead>
                    <tbody>
                      {standings.groups[groupName].map((row) => (
                        <tr key={row.id} className="border-b border-deadlock-brown/30 last:border-0">
                          <td className="p-3 pl-4 text-deadlock-muted align-top">{row.placement ?? "—"}</td>
                          <td className="p-3 align-top">
                            <span className="font-semibold text-white">{row.team.tag}</span>
                            <span className="text-deadlock-muted text-xs block">{row.team.school.name}</span>
                          </td>
                          <td className="p-3 text-deadlock-muted align-top">
                            {row.score != null ? row.score.toFixed(4) : "—"}
                          </td>
                          <td className="p-3 pr-4 text-deadlock-muted text-xs align-top">
                            {row.rankLabel ?? (row.seed != null ? String(row.seed) : "—")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-2xl w-full mt-10 flex flex-wrap items-center justify-center gap-4 text-sm relative z-[1]">
          <Link href="/schedule" className="text-deadlock-muted hover:text-deadlock-gold transition-colors duration-200">
            Schedule
          </Link>
          <Link href="/season-0" className="text-deadlock-muted hover:text-deadlock-gold transition-colors duration-200">
            Season 0
          </Link>
          <Link href="/season-2" className="text-deadlock-muted hover:text-deadlock-gold transition-colors duration-200">
            Season 2
          </Link>
          <Link href="/about" className="text-deadlock-muted hover:text-deadlock-gold transition-colors duration-200">
            About Us
          </Link>
          <Link href="/partners" className="text-deadlock-muted hover:text-deadlock-gold transition-colors duration-200">
            Partners
          </Link>
          <Link href="/news" className="text-deadlock-muted hover:text-deadlock-gold transition-colors duration-200">
            News
          </Link>
        </div>
        <div className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-3 relative z-[1]">
          <Link
            href="/signup"
            className="rounded-lg bg-deadlock-gold px-6 py-2.5 text-sm font-semibold text-deadlock-dark hover:bg-deadlock-gold-light hover:shadow-md hover:shadow-deadlock-gold/20 hover:-translate-y-0.5 transition duration-200"
          >
            Join Now
          </Link>
          <Link
            href="/signup#discord"
            className="rounded-lg border border-deadlock-gold/50 bg-deadlock-gold/10 px-6 py-2.5 text-sm font-medium text-deadlock-gold hover:bg-deadlock-gold/20 hover:border-deadlock-gold/70 hover:-translate-y-0.5 transition duration-200"
          >
            Sign in
          </Link>
        </div>
      </section>
    </div>
  );
}
