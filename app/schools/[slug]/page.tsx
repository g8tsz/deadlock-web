import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  let school: { name: string; city: string | null; state: string | null } | null = null;
  try {
    school = await prisma.school.findUnique({
      where: { slug: params.slug },
      select: { name: true, city: true, state: true },
    });
  } catch {
    return { title: "School" };
  }
  if (!school) return { title: "School" };
  const loc = [school.city, school.state].filter(Boolean).join(", ");
  return {
    title: school.name,
    description: loc
      ? `${school.name} (${loc}) — College Deadlock collegiate Deadlock team.`
      : `${school.name} — College Deadlock collegiate Deadlock team.`,
  };
}

export default async function SchoolPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  let school: Awaited<ReturnType<typeof fetchSchool>> = null;
  try {
    school = await fetchSchool(slug);
  } catch {
    // Database unavailable
  }

  if (!school) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Link href="/schools" className="text-sm text-deadlock-muted hover:text-deadlock-gold mb-6 inline-block">
        ← Schools
      </Link>
      <header className="mb-8 flex flex-wrap items-start gap-6">
        {school.logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element -- dynamic third-party logo URLs
          <img
            src={school.logoUrl}
            alt=""
            className="h-20 w-20 rounded-lg object-contain bg-deadlock-card border border-deadlock-brown"
          />
        )}
        <div>
          <h1 className="text-3xl font-bold text-white">{school.name}</h1>
          {(school.city || school.state) && (
            <p className="text-deadlock-muted mt-1">
              {[school.city, school.state].filter(Boolean).join(", ")}
            </p>
          )}
        </div>
      </header>

      {school.teams.length === 0 ? (
        <p className="text-deadlock-muted">No teams listed for this school yet.</p>
      ) : (
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-white">Teams</h2>
          {school.teams.map((team) => (
            <div
              key={team.id}
              className="rounded-lg border border-deadlock-brown bg-deadlock-card p-6"
            >
              <div className="flex flex-wrap items-center gap-4">
                {team.logoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element -- dynamic third-party logo URLs
                  <img
                    src={team.logoUrl}
                    alt=""
                    className="h-12 w-12 rounded object-contain"
                  />
                )}
                <div>
                  <h3 className="text-lg font-medium text-white">
                    {team.tag} — {team.fullName}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-deadlock-muted">
                    <span>
                      Captains: {team.captains.map((c) => c.discordUsername).join(", ")}
                    </span>
                    {team.staff.length > 0 && (
                      <span>
                        Staff: {team.staff.map((s) => s.discordUsername).join(", ")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {team.eventTeams.length > 0 && (
                <div className="mt-4 pt-4 border-t border-deadlock-brown">
                  <p className="text-xs text-deadlock-muted mb-2">Appeared in</p>
                  <div className="flex flex-wrap gap-2">
                    {team.eventTeams.map((et) => (
                      <Link
                        key={et.id}
                        href={`/events/${et.event.slug}`}
                        className="rounded bg-deadlock-surface px-2 py-1 text-sm text-deadlock-muted hover:text-deadlock-gold"
                      >
                        {et.event.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

async function fetchSchool(slug: string) {
  return prisma.school.findUnique({
    where: { slug },
    include: {
      teams: {
        include: {
          captains: true,
          staff: true,
          eventTeams: {
            include: { event: true },
            orderBy: { event: { startDate: "desc" } },
          },
        },
      },
    },
  });
}
