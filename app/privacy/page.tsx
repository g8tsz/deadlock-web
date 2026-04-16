import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How College Deadlock handles information from this website, Discord sign-in, and forms.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-deadlock-dark">
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Privacy</h1>
        <p className="text-deadlock-muted text-sm mb-10">Last updated {new Date().getFullYear()}</p>

        <div className="space-y-8 text-deadlock-muted text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Overview</h2>
            <p>
              College Deadlock (&quot;we&quot;) runs this website to share schedules, standings, and league information.
              This page summarizes what data the site may process and how we use it. For game-day coordination and
              registration, our primary community is on{" "}
              <a
                href="https://discord.gg/college-deadlock"
                target="_blank"
                rel="noopener noreferrer"
                className="text-deadlock-gold hover:text-deadlock-gold-light"
              >
                Discord
              </a>
              , which has its own terms and privacy practices.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Discord sign-in</h2>
            <p>
              If you use &quot;Sign in with Discord&quot; on this site, authentication is handled by{" "}
              <a
                href="https://next-auth.js.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-deadlock-gold hover:text-deadlock-gold-light"
              >
                NextAuth.js
              </a>{" "}
              with Discord as the identity provider. We may store your Discord user id, display name, avatar URL, and
              email (when Discord shares it) in our database to associate your account with league data. You can
              disconnect by signing out and, if applicable, revoking the app in your Discord settings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Contact and newsletter forms</h2>
            <p>
              When you submit the contact or newsletter forms, we process the fields you provide. If configured by the
              league, submissions may be delivered to staff via a Discord webhook or similar internal tooling. We do
              not sell your personal information. Do not submit sensitive health or financial data through these
              forms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Security and abuse prevention</h2>
            <p>
              We may use rate limiting, optional bot checks (such as Cloudflare Turnstile), and hidden honeypot fields
              to reduce spam. Those services may receive technical data (such as IP address) as described in their own
              policies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Cookies and local storage</h2>
            <p>
              Session cookies are used when you sign in. Analytics or advertising cookies are not required to browse
              this site.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">Questions</h2>
            <p>
              Contact us through{" "}
              <Link href="/contact" className="text-deadlock-gold hover:text-deadlock-gold-light">
                the contact page
              </Link>{" "}
              or Discord for privacy-related questions.
            </p>
          </section>
        </div>

        <p className="mt-12">
          <Link href="/" className="text-deadlock-gold hover:text-deadlock-gold-light text-sm font-semibold">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
