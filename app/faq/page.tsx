import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about College Deadlock and the Deadlock Collegiate Series — eligibility, signups, format, and more.",
};

const faqs: { q: string; a: React.ReactNode }[] = [
  {
    q: "What is College Deadlock?",
    a: (
      <>
        College Deadlock runs the Deadlock Collegiate Series — a North American
        collegiate esports league for Valve&apos;s Deadlock. We organize seasons,
        conferences, and playoffs for university teams, with an emphasis on a
        sustainable, community-first competitive scene.
      </>
    ),
  },
  {
    q: "Who is eligible to play?",
    a: (
      <>
        Any currently enrolled student at a North American college or university
        can compete. A team must represent a single recognized school. Eligibility
        details (credit hours, graduate students, alumni restrictions) are
        finalized each season and posted in our Discord.
      </>
    ),
  },
  {
    q: "How do I sign up my team or myself?",
    a: (
      <>
        All signups happen through our{" "}
        <a
          href="https://discord.gg/college-deadlock"
          target="_blank"
          rel="noopener noreferrer"
          className="text-deadlock-gold hover:text-deadlock-gold-light"
        >
          Discord server
        </a>
        . Head to <Link href="/signup" className="text-deadlock-gold hover:text-deadlock-gold-light">/signup</Link> for
        a walkthrough. Team registration, match signups, and season enrollment
        are all handled there so everything stays linked to your Discord account.
      </>
    ),
  },
  {
    q: "Does it cost anything to participate?",
    a: (
      <>
        No — competing in the Deadlock Collegiate Series is free for students.
        Prize pools are funded by our partners and sponsors.
      </>
    ),
  },
  {
    q: "What is the season format?",
    a: (
      <>
        Seasons run over several weeks of round-robin group play followed by a
        playoff bracket. Group sizes, match formats (Bo1 / Bo3 / Bo5), and
        playoff structure are announced per season. Check{" "}
        <Link href="/season-2" className="text-deadlock-gold hover:text-deadlock-gold-light">
          the current season page
        </Link>{" "}
        for the active format.
      </>
    ),
  },
  {
    q: "Where can I watch the matches?",
    a: (
      <>
        Most marquee matches stream on our Twitch channel at{" "}
        <a
          href="https://twitch.tv/collegedeadlock"
          target="_blank"
          rel="noopener noreferrer"
          className="text-deadlock-gold hover:text-deadlock-gold-light"
        >
          twitch.tv/collegedeadlock
        </a>
        . VODs go up on{" "}
        <a
          href="https://youtube.com/@collegedeadlock"
          target="_blank"
          rel="noopener noreferrer"
          className="text-deadlock-gold hover:text-deadlock-gold-light"
        >
          YouTube
        </a>{" "}
        after each match day.
      </>
    ),
  },
  {
    q: "My school isn't on the schools page — can we still join?",
    a: (
      <>
        Yes. If your school doesn&apos;t have a team yet, start one! Join the
        Discord, say hi in the new-teams channel, and we&apos;ll help you get set
        up with a captain, roster, and conference placement.
      </>
    ),
  },
  {
    q: "How are conferences (East / West) assigned?",
    a: (
      <>
        Schools are placed into the East or West conference based on geography so
        matches are scheduled at reasonable times for everyone. Exceptions are
        handled case-by-case in Discord.
      </>
    ),
  },
  {
    q: "I'm a partner, sponsor, or caster — how do I get in touch?",
    a: (
      <>
        Use our{" "}
        <Link href="/contact" className="text-deadlock-gold hover:text-deadlock-gold-light">
          contact form
        </Link>{" "}
        or DM the staff in Discord. We&apos;re actively looking to grow the
        league with the right partners.
      </>
    ),
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-deadlock-dark">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Frequently asked questions</h1>
        <p className="text-deadlock-muted mb-10">
          Answers to the most common questions about the Deadlock Collegiate Series. Still stuck?
          Ask in{" "}
          <a
            href="https://discord.gg/college-deadlock"
            target="_blank"
            rel="noopener noreferrer"
            className="text-deadlock-gold hover:text-deadlock-gold-light"
          >
            Discord
          </a>{" "}
          or via our{" "}
          <Link href="/contact" className="text-deadlock-gold hover:text-deadlock-gold-light">
            contact form
          </Link>
          .
        </p>

        <div className="space-y-3">
          {faqs.map(({ q, a }) => (
            <details
              key={q}
              className="group rounded-xl border border-deadlock-brown bg-deadlock-card/60 open:bg-deadlock-card open:border-deadlock-gold/40 transition"
            >
              <summary className="cursor-pointer list-none px-5 py-4 flex items-start justify-between gap-4">
                <span className="text-white font-semibold">{q}</span>
                <span
                  aria-hidden
                  className="mt-1 text-deadlock-gold shrink-0 transition group-open:rotate-45 text-xl leading-none"
                >
                  +
                </span>
              </summary>
              <div className="px-5 pb-5 text-deadlock-muted text-sm leading-relaxed">{a}</div>
            </details>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link
            href="/contact"
            className="rounded-lg bg-deadlock-gold px-5 py-2.5 text-sm font-semibold text-deadlock-dark hover:bg-deadlock-gold-light transition"
          >
            Contact us
          </Link>
          <Link href="/" className="text-deadlock-gold hover:text-deadlock-gold-light text-sm font-semibold">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
