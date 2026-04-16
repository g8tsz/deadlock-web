import Link from "next/link";
import type { Metadata } from "next";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Season 2",
  description: "Deadlock Collegiate Series Season 2 — schedule, format, and registration via Discord.",
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

export default function Season2Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Deadlock Collegiate Series</h1>
      <p className="text-deadlock-gold font-semibold mb-8">Season 2 — Current Season</p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-white mb-4">
          Introducing: the Deadlock Collegiate Series - Season 2
        </h2>
        <p className="text-deadlock-muted leading-relaxed mb-4">
          The Deadlock Collegiate Series is the premiere deadlock collegiate tournament. Season 2
          builds on the success of our earlier seasons, bringing more schools, more matches, and
          more competition to collegiate Deadlock.
        </p>
        <p className="text-deadlock-muted leading-relaxed mb-6">
          All signups—matches, teams, and registration—are done through our Discord. Join the server
          to compete and stay updated.
        </p>
        <div className="flex flex-wrap gap-4 items-center">
          <a
            href={RULEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-deadlock-gold px-4 py-2 text-sm font-semibold text-deadlock-dark hover:bg-deadlock-gold-light transition"
          >
            Rulebook
          </a>
          <a
            href="https://discord.gg/college-deadlock"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg border border-deadlock-gold/50 bg-deadlock-gold/10 px-4 py-2 text-sm font-semibold text-deadlock-gold hover:bg-deadlock-gold/20 transition"
          >
            Join Discord to sign up
          </a>
        </div>
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
          Sign up for our newsletter to get update information, news, and insight.
        </p>
        <NewsletterForm />
      </section>

      <nav className="mt-12 pt-8 border-t border-deadlock-brown flex flex-wrap gap-6 text-sm text-deadlock-muted">
        <Link href="/season-0" className="hover:text-deadlock-gold transition">Season 0 (archive)</Link>
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
