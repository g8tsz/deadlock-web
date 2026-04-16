import Link from "next/link";
import type { Metadata } from "next";
import NewsletterForm from "@/components/NewsletterForm";

const DISCORD_INVITE = "https://discord.gg/college-deadlock";

export const metadata: Metadata = {
  title: "Join",
  description:
    "Join College Deadlock via Discord — team registration, match signups, and community. Optional newsletter updates.",
};

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Join College Deadlock</h1>
      <p className="text-deadlock-muted mb-8">
        All signups—matches, teams, and seasons—are done through our Discord. Join there to register and get everything game-related in one place.
      </p>

      {/* Primary: sign up via Discord */}
      <section className="mb-10 rounded-xl border-2 border-deadlock-gold/50 bg-deadlock-card/50 p-6">
        <h2 className="text-lg font-semibold text-deadlock-cream mb-2">Sign up via Discord</h2>
        <p className="text-deadlock-muted text-sm mb-4">
          Match signups, team registration, and all game-related signups happen in our Discord server. Your Discord account (and when you sign in here, your email) keeps everything linked.
        </p>
        <a
          href={DISCORD_INVITE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex rounded-lg bg-[#5865F2] px-6 py-3 font-semibold text-white hover:opacity-90 transition"
        >
          Join Discord to sign up
        </a>
      </section>

      {/* Optional: newsletter (email) - links with Discord when they sign in */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-deadlock-cream mb-3">Optional: get updates by email</h2>
        <p className="text-deadlock-muted text-sm mb-4">
          Want news and schedule updates by email? Sign up below. When you sign in with Discord on this site, we link your Discord and email so you stay connected everywhere.
        </p>
        <NewsletterForm />
      </section>

      {/* Sign in with Discord */}
      <section id="discord" className="border-t border-deadlock-brown pt-8">
        <h2 className="text-lg font-semibold text-deadlock-cream mb-3">Sign in on this website</h2>
        <p className="text-deadlock-muted text-sm mb-4">
          Already in our Discord? Use the &quot;Sign in with Discord&quot; button in the header to sign in here. That links your Discord identity and lets us connect your email if you signed up for the newsletter.
        </p>
        <p className="text-deadlock-muted text-xs">
          All match and game signups still happen in Discord—we just use sign-in here to personalize the site and keep your info linked (Discord, stream ID, email).
        </p>
      </section>

      <p className="mt-10 text-center">
        <Link href="/" className="text-deadlock-gold hover:text-deadlock-gold-light text-sm font-semibold">
          ← Back to home
        </Link>
      </p>
    </div>
  );
}
