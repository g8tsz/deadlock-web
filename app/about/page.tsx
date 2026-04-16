import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "College Deadlock staff and mission — building a sustainable collegiate Deadlock esports scene in North America.",
};

const team = [
  { name: 'Caleb "Stormwarrior" Roggi', role: "Managing Director" },
  { name: 'Zach "Bailable" Schryer', role: "Director of Competition" },
  { name: 'Shane "Embered" Thompson', role: "Marketing Director" },
  { name: 'Chaz "Vellication"', role: "Community Director" },
  { name: "Toasty", role: "Tournament Organizer and Analyst" },
];

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-deadlock-dark">
      <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">The future of college esports.</h1>
      <p className="text-deadlock-gold font-semibold mb-10">
        Bringing the future of college esports to deadlock.
      </p>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-3">About College Deadlock</h2>
        <p className="text-deadlock-gold font-semibold mb-3">
          Experienced and Dedicated management Team.
        </p>
        <p className="text-deadlock-muted leading-relaxed mb-6">
          Our management team is made up of passionate esports enthusiasts from diverse backgrounds
          across the industry. We are dedicated to driving the future of esports by promoting
          sustainable growth and fostering a friendly, competitive environment. With a deep
          understanding of the industry, we&apos;re committed to shaping the next generation of
          esports.
        </p>
        <Link
          href="/season-2"
          className="text-deadlock-gold hover:text-deadlock-gold-light font-semibold"
        >
          Discover more
        </Link>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-3">Our history</h2>
        <p className="text-deadlock-gold font-semibold mb-3">It all starts with an idea.</p>
        <p className="text-deadlock-muted leading-relaxed mb-4">
          We are a passionate team of esports professionals excited to introduce a fresh concept to
          the industry. Our journey began with a vision to bring Deadlock to a new generation of
          collegiate gamers, fostering growth and innovation in the collegiate esports space.
        </p>
        <p className="text-deadlock-muted leading-relaxed">
          As dedicated fans and regular players of the game, we thrive on the excitement of
          competition and are fully committed to both the craft and the sustainable future of
          esports. Leveraging the stability of collegiate esports, we aim to elevate Deadlock as the
          next big title in MOBA esports, driving its growth within the collegiate scene and beyond.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-xl font-bold text-white mb-2">Our Team</h2>
        <p className="text-deadlock-muted text-sm mb-6">Experienced Management</p>
        <div className="grid gap-6 sm:grid-cols-2">
          {team.map((member) => (
            <div
              key={member.name}
              className="flex items-center gap-4 rounded-xl border border-deadlock-brown bg-deadlock-card p-4"
            >
              <div className="h-14 w-14 shrink-0 rounded-full bg-deadlock-surface border border-deadlock-brown overflow-hidden flex items-center justify-center">
                <Image
                  src="/college-logo.png"
                  alt=""
                  width={32}
                  height={32}
                  className="object-contain opacity-80"
                />
              </div>
              <div>
                <p className="font-semibold text-white">{member.name}</p>
                <p className="text-sm text-deadlock-gold">{member.role}</p>
                <Link
                  href="/contact"
                  className="text-xs text-deadlock-muted hover:text-deadlock-gold mt-1 inline-block"
                >
                  Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-deadlock-brown pt-10">
        <h2 className="text-xl font-bold text-white mb-4">Need Help?</h2>
        <p className="text-deadlock-muted text-sm mb-6">
          Our experienced management team is ready at a moment&apos;s notice to support any issues
          that may arise. Leave us a message!
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/contact"
            className="rounded-lg bg-deadlock-gold px-6 py-3 font-semibold text-deadlock-dark hover:bg-deadlock-gold-light transition"
          >
            Contact
          </Link>
          <Link
            href="/contact?sponsor=1"
            className="rounded-lg border border-deadlock-brown px-6 py-3 font-medium text-deadlock-muted hover:border-deadlock-gold hover:text-white transition"
          >
            Sponsor Us
          </Link>
          <Link
            href="/contact"
            className="rounded-lg border border-deadlock-brown px-6 py-3 font-medium text-deadlock-muted hover:border-deadlock-gold hover:text-white transition"
          >
            Community
          </Link>
        </div>
        <p className="text-deadlock-muted text-sm mt-4">
          We are looking for sponsorship to help support the league and maintain sustainable growth.
          Please leave a message if you are interested!
        </p>
        <p className="text-deadlock-muted text-sm mt-1">
          We want to give back to the community and help collegiate grow. If you would like to work
          with us, send us a message!
        </p>
      </section>
      </div>
    </div>
  );
}
