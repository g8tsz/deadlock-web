import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import SupportForm from "@/components/SupportForm";

export const metadata: Metadata = {
  title: "Partners",
  description: "College Deadlock partners and sponsors supporting collegiate Deadlock esports.",
};

export default function PartnersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Thank you for your support!</h1>
      <p className="text-deadlock-muted mb-4">
        Check out our amazing partners who help keep this organization going!
      </p>
      <p className="text-deadlock-muted mb-10">
        Join us in building the future of collegiate esports.
      </p>
      <p className="text-deadlock-muted text-sm mb-10">
        If you are interested in supporting our league, please reach out to us, we would love to work
        with you! All support is very appreciated!
      </p>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
        {/* FITGMR */}
        <div className="rounded-xl border border-deadlock-brown bg-deadlock-card p-6 hover:border-deadlock-gold/40 hover:shadow-lg hover:shadow-deadlock-gold/5 transition duration-200">
          <div className="h-16 flex items-center justify-center mb-4 text-xl font-bold text-white">
            FITGMR
          </div>
          <p className="text-deadlock-muted text-sm leading-relaxed mb-4">
            FITGMR is a science-backed performance and wellness platform designed for gamers. FITGMR
            provides training, insights, and community engagement to help players improve cognitive
            function, physical endurance, and gameplay performance.
          </p>
          <a
            href="https://fitgmr.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-deadlock-gold hover:text-deadlock-gold-light text-sm font-semibold"
          >
            Visit Website
          </a>
        </div>

        {/* Placeholder 1 */}
        <div className="rounded-xl border border-deadlock-brown bg-deadlock-card p-6 flex flex-col items-center text-center hover:border-deadlock-gold/40 hover:shadow-lg hover:shadow-deadlock-gold/5 transition duration-200">
          <div className="h-16 w-16 relative mb-4 rounded-lg bg-deadlock-surface border border-deadlock-brown flex items-center justify-center overflow-hidden">
            <Image src="/college-logo.png" alt="Partner logo" width={64} height={64} sizes="64px" className="object-contain" />
          </div>
          <p className="font-semibold text-white mb-2">Your Brand Here</p>
          <p className="text-deadlock-muted text-sm mb-4">
            Support us and we&apos;ll work out a package that works great for both of us and helps you
            convert sales!
          </p>
          <span className="text-deadlock-gold text-sm font-semibold">Visit website</span>
        </div>

        {/* Placeholder 2 */}
        <div className="rounded-xl border border-deadlock-brown bg-deadlock-card p-6 flex flex-col items-center text-center hover:border-deadlock-gold/40 hover:shadow-lg hover:shadow-deadlock-gold/5 transition duration-200">
          <div className="h-16 w-16 relative mb-4 rounded-lg bg-deadlock-surface border border-deadlock-brown flex items-center justify-center overflow-hidden">
            <Image src="/college-logo.png" alt="Partner logo" width={64} height={64} sizes="64px" className="object-contain" />
          </div>
          <p className="font-semibold text-white mb-2">Your Brand Here</p>
          <p className="text-deadlock-muted text-sm mb-4">
            Support us and we&apos;ll work out a package that works great for both of us and helps you
            convert sales!
          </p>
          <span className="text-deadlock-gold text-sm font-semibold">Visit website</span>
        </div>

        {/* Placeholder 3 */}
        <div className="rounded-xl border border-deadlock-brown bg-deadlock-card p-6 flex flex-col items-center text-center sm:col-span-2 lg:col-span-1 hover:border-deadlock-gold/40 hover:shadow-lg hover:shadow-deadlock-gold/5 transition duration-200">
          <div className="h-16 w-16 relative mb-4 rounded-lg bg-deadlock-surface border border-deadlock-brown flex items-center justify-center overflow-hidden">
            <Image src="/college-logo.png" alt="Partner logo" width={64} height={64} sizes="64px" className="object-contain" />
          </div>
          <p className="font-semibold text-white mb-2">Your Brand Here</p>
          <p className="text-deadlock-muted text-sm mb-4">
            Support us and we&apos;ll work out a package that works great for both of us and helps you
            convert sales!
          </p>
          <span className="text-deadlock-gold text-sm font-semibold">Visit website</span>
        </div>
      </div>

      <section className="border-t border-deadlock-brown pt-12">
        <h2 className="text-xl font-bold text-white mb-2">Sponsor us</h2>
        <p className="text-deadlock-muted mb-6">
          Interested in supporting the league? Send us an email using the contact form and we will be
          in touch to work out a plan that is mutually beneficial!
        </p>
        <SupportForm />
      </section>
    </div>
  );
}
