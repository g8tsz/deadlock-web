import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-deadlock-dark text-deadlock-cream">
      <p className="text-xs font-semibold uppercase tracking-wider text-deadlock-gold mb-2">404</p>
      <h1 className="text-2xl font-bold text-white mb-2 text-center">Page not found</h1>
      <p className="text-deadlock-muted text-center max-w-md mb-8 text-sm">
        That link may be outdated or the page was moved. Try the schedule, news, or Discord for the latest.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-deadlock-gold px-6 py-2.5 text-sm font-semibold text-deadlock-dark hover:bg-deadlock-gold-light transition"
        >
          Home
        </Link>
        <Link
          href="/schedule"
          className="rounded-lg border border-deadlock-brown px-6 py-2.5 text-sm font-medium text-deadlock-muted hover:border-deadlock-gold hover:text-white transition"
        >
          Schedule
        </Link>
        <a
          href="https://discord.gg/college-deadlock"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-[#5865F2]/50 bg-[#5865F2]/15 px-6 py-2.5 text-sm font-semibold text-[#dbeafe] hover:bg-[#5865F2]/25 transition"
        >
          Discord
        </a>
      </div>
    </div>
  );
}
