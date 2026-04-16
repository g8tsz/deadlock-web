"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/schedule", label: "Schedule" },
  { href: "/season-0", label: "Season 0" },
  { href: "/season-2", label: "Season 2" },
  { href: "/about", label: "About Us" },
  { href: "/partners", label: "Partners" },
  { href: "/news", label: "News" },
];

export default function Header({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const linkClass = (href: string) =>
    pathname === href
      ? "text-deadlock-gold font-semibold"
      : "text-deadlock-muted hover:text-deadlock-gold transition";

  return (
    <header className="sticky top-0 z-50 border-b border-deadlock-brown bg-deadlock-dark/98 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex shrink-0 items-center gap-3" onClick={() => setMobileOpen(false)}>
          <Image
            src="/college-logo.png"
            alt="College Deadlock"
            width={36}
            height={36}
            sizes="36px"
            priority
            className="h-9 w-9 object-contain"
          />
          <span className="text-xl font-semibold text-deadlock-cream">College Deadlock</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className={linkClass(href)}>
              {label}
            </Link>
          ))}
          <a
            href="https://discord.gg/college-deadlock"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-[#5865F2]/50 bg-[#5865F2]/15 px-3 py-2 text-sm font-semibold text-[#dbeafe] hover:bg-[#5865F2]/25 transition hidden sm:inline-flex"
          >
            Discord
          </a>
          <Link
            href="/signup"
            className="rounded-md bg-deadlock-gold px-4 py-2 text-sm font-semibold text-deadlock-dark hover:bg-deadlock-gold-light hover:shadow-md hover:shadow-deadlock-gold/20 hover:-translate-y-0.5 transition"
          >
            Join Now
          </Link>
          {session?.user ? (
            <div className="flex items-center gap-3">
              {session.user.image && (
                <Image
                  src={session.user.image}
                  alt=""
                  width={32}
                  height={32}
                  sizes="32px"
                  className="h-8 w-8 rounded-full border border-deadlock-gold/30 object-cover"
                />
              )}
              <span className="text-sm text-deadlock-muted">{session.user.name}</span>
              <button
                onClick={() => signOut()}
                className="text-sm text-deadlock-muted hover:text-white transition"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("discord")}
              className="rounded-md border border-deadlock-gold/50 bg-deadlock-gold/10 px-4 py-2 text-sm font-medium text-deadlock-gold hover:bg-deadlock-gold/20 hover:border-deadlock-gold/70 hover:-translate-y-0.5 transition"
            >
              Sign in with Discord
            </button>
          )}
        </nav>

        {/* Mobile: hamburger + menu */}
        <div className="flex md:hidden items-center gap-2">
          {session?.user && session.user.image && (
            <Image
              src={session.user.image}
              alt=""
              width={28}
              height={28}
              sizes="28px"
              className="h-7 w-7 rounded-full border border-deadlock-gold/30 object-cover"
            />
          )}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-lg p-2 text-deadlock-cream hover:bg-deadlock-card focus:outline-none focus:ring-2 focus:ring-deadlock-gold"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-deadlock-brown bg-deadlock-dark">
          <nav className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`block py-3 px-3 rounded-lg ${linkClass(href)}`}
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ))}
            <a
              href="https://discord.gg/college-deadlock"
              target="_blank"
              rel="noopener noreferrer"
              className="block py-3 px-3 rounded-lg border border-[#5865F2]/50 bg-[#5865F2]/15 text-center font-semibold text-[#dbeafe] mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Join Discord
            </a>
            <Link
              href="/signup"
              className="block py-3 px-3 rounded-lg bg-deadlock-gold text-deadlock-dark font-semibold text-center mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Join Now
            </Link>
            {session?.user ? (
              <div className="pt-3 mt-2 border-t border-deadlock-brown flex items-center justify-between">
                <span className="text-sm text-deadlock-muted">{session.user.name}</span>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="text-sm text-deadlock-gold hover:text-deadlock-gold-light"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { signIn("discord"); setMobileOpen(false); }}
                className="w-full py-3 px-3 rounded-lg border border-deadlock-gold/50 text-deadlock-gold font-medium mt-2"
              >
                Sign in with Discord
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
