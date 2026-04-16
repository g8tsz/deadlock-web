import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

const socials = [
  { name: "Discord", href: "https://discord.gg/college-deadlock" },
  { name: "Twitch", href: "https://twitch.tv/collegedeadlock" },
  { name: "Twitter", href: "https://twitter.com/collegedeadlock" },
  { name: "Youtube", href: "https://youtube.com/@collegedeadlock" },
];

export default function Footer() {
  return (
    <footer className="border-t border-deadlock-brown bg-deadlock-card mt-24">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <h3 className="text-lg font-bold text-white">College Deadlock</h3>
            <p className="mt-2 text-sm text-deadlock-muted">
              The premier collegiate Deadlock esports series.
            </p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-deadlock-gold">
              Connect with us!
            </p>
            <div className="mt-3 flex flex-wrap gap-4">
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
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-deadlock-gold mb-2">
                Sign up for our newsletter
              </p>
              <p className="text-sm text-deadlock-muted mb-2">
                Sign up for our newsletter to get update information, news, and insight.
              </p>
              <NewsletterForm />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">About</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/about" className="text-deadlock-muted hover:text-deadlock-gold text-sm transition">About us</Link></li>
              <li><Link href="/partners" className="text-deadlock-muted hover:text-deadlock-gold text-sm transition">Partner</Link></li>
              <li><Link href="/season-0" className="text-deadlock-muted hover:text-deadlock-gold text-sm transition">Season 0</Link></li>
              <li><Link href="/season-2" className="text-deadlock-muted hover:text-deadlock-gold text-sm transition">Season 2</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Conferences</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/conferences#east" className="text-deadlock-muted hover:text-deadlock-gold text-sm transition">East</Link></li>
              <li><Link href="/conferences#west" className="text-deadlock-muted hover:text-deadlock-gold text-sm transition">West</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Support</h4>
            <ul className="mt-3 space-y-2">
              <li><Link href="/contact" className="text-deadlock-muted hover:text-deadlock-gold text-sm transition">Contact us</Link></li>
              <li><Link href="/faq" className="text-deadlock-muted hover:text-deadlock-gold text-sm transition">FAQ</Link></li>
              <li><Link href="/events" className="text-deadlock-muted hover:text-deadlock-gold text-sm transition">Events</Link></li>
              <li><Link href="/schedule" className="text-deadlock-muted hover:text-deadlock-gold text-sm transition">Schedule</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-deadlock-brown text-center text-sm text-deadlock-muted space-y-1">
          <p>Copyright © {new Date().getFullYear()} College Deadlock. All rights reserved.</p>
          <p>
            Game data and assets:{" "}
            <a
              href="https://deadlock-api.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-deadlock-gold hover:text-deadlock-gold-light"
            >
              Deadlock API
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
