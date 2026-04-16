import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conferences",
  description: "College Deadlock East and West conferences — regional collegiate competition.",
};

export default function ConferencesPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-deadlock-dark">
      <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8">Conferences</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        <section id="east" className="rounded-xl border border-deadlock-brown bg-deadlock-card p-6">
          <h2 className="text-lg font-semibold text-deadlock-gold mb-4">East</h2>
          <p className="text-deadlock-muted text-sm">Schools and teams in the East conference.</p>
          <Link href="/schools" className="mt-4 inline-block text-deadlock-gold hover:text-deadlock-gold-light text-sm font-semibold">
            View schools →
          </Link>
        </section>
        <section id="west" className="rounded-xl border border-deadlock-brown bg-deadlock-card p-6">
          <h2 className="text-lg font-semibold text-deadlock-gold mb-4">West</h2>
          <p className="text-deadlock-muted text-sm">Schools and teams in the West conference.</p>
          <Link href="/schools" className="mt-4 inline-block text-deadlock-gold hover:text-deadlock-gold-light text-sm font-semibold">
            View schools →
          </Link>
        </section>
      </div>
      </div>
    </div>
  );
}
