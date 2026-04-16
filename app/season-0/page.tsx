import Link from "next/link";
import type { Metadata } from "next";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Season 0",
  description:
    "Deadlock Collegiate Series Season 0 — format, rulebook, and how we built the foundation for collegiate Deadlock.",
};

const RULEBOOK_URL =
  "https://docs.google.com/document/d/16Zm2_ZepICBxK7zNVHMC0PyiiEwMxNQMHdDj626T700/edit?pli=1&tab=t.0#heading=h.z26385bj2u3r";

const socials = [
  { name: "Facebook", href: "#" },
  { name: "Discord", href: "https://discord.gg/college-deadlock" },
  { name: "Twitch", href: "https://twitch.tv/collegedeadlock" },
  { name: "Youtube", href: "https://youtube.com/@collegedeadlock" },
  { name: "Instagram", href: "#" },
];

export default function Season0Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Deadlock Collegiate Series</h1>
      <p className="text-deadlock-gold font-semibold mb-8">Season 0 Information</p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">
          Introducing: the Deadlock Collegiate Series - Season 0
        </h2>
        <p className="text-deadlock-muted leading-relaxed mb-4">
          The Deadlock Collegiate Series is the premiere deadlock collegiate tournament. Season 0 is
          aimed at gathering interest from esports programs, building up the scene for the game, and
          to help work out the issues that may arise during season 1 and beyond.
        </p>
        <p className="text-deadlock-muted leading-relaxed mb-4">
          Season 0 will feature a 7-week main season, that consists of 1 BO3 matches per week in a
          round robin format. The playoffs will be a single elimination bracket consisting of 8 teams,
          the top 4 from each group. Sign ups open on October 14, 2024 and close on January 31, 2025.
          Season 0 Week 1 begins on February 4, 2025.
        </p>
        <p className="text-deadlock-muted leading-relaxed mb-6">
          For Season 0, we want to get as much interest as possible, therefore there will be no
          membership or entry fees to allow for as many schools as possible to participate! This is
          subject to change for season one and beyond to maintain the sustainability of the league.
        </p>
        <div className="flex flex-wrap gap-4 items-center">
          <span className="rounded-lg bg-deadlock-brown/50 px-4 py-2 text-sm font-semibold text-deadlock-muted">
            Registration Closed
          </span>
          <a
            href={RULEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-deadlock-gold px-4 py-2 text-sm font-semibold text-deadlock-dark hover:bg-deadlock-gold-light transition"
          >
            Rulebook
          </a>
        </div>
        <p className="text-deadlock-muted text-sm mt-4">
          When registration is open, all signups are done through our{" "}
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
      </section>

      <section className="border-t border-deadlock-brown pt-8 mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-deadlock-gold mb-3">
          Connect with us!
        </p>
        <div className="flex flex-wrap gap-4">
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="text-deadlock-muted hover:text-deadlock-gold text-sm transition"
            >
              {s.name}
            </a>
          ))}
        </div>
      </section>

      <section className="border-t border-deadlock-brown pt-8">
        <p className="text-sm font-semibold text-deadlock-gold mb-2">Sign up for our newsletter</p>
        <p className="text-deadlock-muted text-sm mb-3">
          Get update information, news, and insight.
        </p>
        <NewsletterForm />
      </section>

      <nav className="mt-12 pt-8 border-t border-deadlock-brown flex flex-wrap gap-6 text-sm text-deadlock-muted">
        <Link href="/about" className="hover:text-deadlock-gold transition">About us</Link>
        <Link href="/partners" className="hover:text-deadlock-gold transition">Partner</Link>
        <Link href="/conferences" className="hover:text-deadlock-gold transition">Conferences (East / West)</Link>
        <Link href="/contact" className="hover:text-deadlock-gold transition">Contact us</Link>
        <Link href="/faq" className="hover:text-deadlock-gold transition">FAQ</Link>
        <Link href="/schedule" className="hover:text-deadlock-gold transition">Schedule</Link>
      </nav>
    </div>
  );
}
