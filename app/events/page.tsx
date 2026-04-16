import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Past and current College Deadlock tournaments and show matches — see participating schools and results.",
};

async function fetchEvents() {
  return prisma.event.findMany({
    orderBy: { startDate: "desc" },
    include: { _count: { select: { eventTeams: true } } },
  });
}

export default async function EventsPage() {
  let events: Awaited<ReturnType<typeof fetchEvents>> = [];
  try {
    events = await fetchEvents();
  } catch {
    // Database unavailable
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Events</h1>
      <p className="text-deadlock-muted mb-4 max-w-2xl">
        Past and current College Deadlock tournaments and show matches. Each event page lists participating schools —
        useful for sponsors and programs evaluating the league.
      </p>
      <p className="text-deadlock-muted text-sm mb-8">
        Looking for the live season? Start with the event marked <span className="text-deadlock-gold">Current</span>, or
        open <Link href="/schedule" className="text-deadlock-gold hover:text-deadlock-gold-light font-semibold">Schedule</Link>{" "}
        for match times.
      </p>
      <div className="space-y-4">
        {events.map((event) => (
          <Link
            key={event.id}
            href={`/events/${event.slug}`}
            className="block rounded-lg border border-deadlock-brown bg-deadlock-card p-6 hover:border-deadlock-gold/30 transition"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {event.name}
                  {event.isCurrent && (
                    <span className="ml-2 rounded bg-deadlock-gold/20 px-2 py-0.5 text-xs text-deadlock-gold">
                      Current
                    </span>
                  )}
                </h2>
                <p className="text-sm text-deadlock-muted mt-1">
                  {event.type && `${event.type} · `}
                  {event.startDate
                    ? new Date(event.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Date TBD"}
                </p>
              </div>
              <span className="text-deadlock-muted text-sm">
                {event._count.eventTeams} team{event._count.eventTeams !== 1 ? "s" : ""}
              </span>
            </div>
            {event.description && (
              <p className="mt-3 text-deadlock-muted text-sm line-clamp-2">
                {event.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
