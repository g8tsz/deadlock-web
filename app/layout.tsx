import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSiteUrl } from "@/lib/site";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "College Deadlock | Collegiate Esports",
    template: "%s | College Deadlock",
  },
  description:
    "Deadlock Collegiate Series — North American collegiate esports tournaments, schedules, standings, and community.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "College Deadlock",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch {
    // Auth or DB may be unavailable (e.g. missing DISCORD_* or DATABASE_URL in preview)
  }

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "College Deadlock",
    url: siteUrl,
    description: "Collegiate Deadlock esports league — Deadlock Collegiate Series.",
    sport: "Esports",
  };

  return (
    <html lang="en" className="bg-[#1a120b] text-[#f5f0e8]">
      <body className="min-h-screen bg-[#1a120b] text-[#f5f0e8] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Providers session={session}>
          <Header session={session} />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
