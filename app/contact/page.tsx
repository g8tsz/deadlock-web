import Link from "next/link";
import type { Metadata } from "next";
import SupportForm from "@/components/SupportForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact College Deadlock — questions, feedback, and partnership inquiries.",
};

export default function ContactPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-deadlock-dark">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <h1 className="text-3xl font-bold text-white mb-2">Contact us</h1>
        <p className="text-deadlock-muted mb-8">
          We value any type of feedback or questions you may have. Fill out the form below or reach out via Discord.
        </p>

        <div className="rounded-xl border border-deadlock-brown bg-deadlock-card p-8 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">Get in touch</h2>
          <SupportForm />
        </div>

        <p className="text-deadlock-muted text-sm mb-4">
          Prefer Discord?{" "}
          <a
            href="https://discord.gg/college-deadlock"
            target="_blank"
            rel="noopener noreferrer"
            className="text-deadlock-gold hover:text-deadlock-gold-light"
          >
            Join our server
          </a>
        </p>

        <p className="mt-8">
          <Link href="/" className="text-deadlock-gold hover:text-deadlock-gold-light">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
