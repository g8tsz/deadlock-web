import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Schools",
  description: "Universities and teams in the College Deadlock league — past and current season programs.",
};

async function fetchSchools() {
  return prisma.school.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { teams: true } } },
  });
}

export default async function SchoolsPage() {
  let schools: Awaited<ReturnType<typeof fetchSchools>> = [];
  try {
    schools = await fetchSchools();
  } catch {
    // Database unavailable
  }

  const thisSeason = schools.filter((s) => s.thisSeason);
  const previous = schools.filter((s) => !s.thisSeason);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Schools</h1>
      <p className="text-deadlock-muted mb-8">
        Universities and colleges that have participated in College Deadlock.
      </p>

      {thisSeason.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-white mb-4">This season</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {thisSeason.map((school) => (
              <Link
                key={school.id}
                href={`/schools/${school.slug}`}
                className="rounded-lg border border-deadlock-brown bg-deadlock-card p-4 hover:border-deadlock-gold/30 transition"
              >
                <h3 className="font-medium text-white">{school.name}</h3>
                <p className="text-sm text-deadlock-muted mt-1">
                  {school.city && school.state && `${school.city}, ${school.state}`}
                  {school._count.teams > 0 && ` · ${school._count.teams} team(s)`}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Previously participated</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {previous.map((school) => (
            <Link
              key={school.id}
              href={`/schools/${school.slug}`}
              className="rounded-lg border border-deadlock-brown bg-deadlock-card p-4 hover:border-deadlock-gold/30 transition"
            >
              <h3 className="font-medium text-white">{school.name}</h3>
              <p className="text-sm text-deadlock-muted mt-1">
                {school.city && school.state && `${school.city}, ${school.state}`}
                {school._count.teams > 0 && ` · ${school._count.teams} team(s)`}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
