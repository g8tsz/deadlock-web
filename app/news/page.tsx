import Link from "next/link";
import type { Metadata } from "next";
import { newsPosts } from "@/lib/news-posts";

export const metadata: Metadata = {
  title: "News",
  description: "College Deadlock announcements, partnerships, and season updates.",
};

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">News and Insights</h1>
      <p className="text-deadlock-muted mb-10">Informational</p>

      <div className="space-y-10">
        {newsPosts.map((post) => (
          <article key={post.slug} id={post.slug} className="border-b border-deadlock-brown pb-10 last:border-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-deadlock-gold mb-1">{post.category}</p>
            <p className="text-deadlock-muted text-xs mb-2">{post.author}</p>
            <h2 className="text-xl font-semibold text-white mb-3">{post.title}</h2>
            <p className="text-deadlock-muted leading-relaxed">{post.excerpt}</p>
            <Link
              href={`/news/${post.slug}`}
              className="mt-3 inline-block text-deadlock-gold hover:text-deadlock-gold-light text-sm font-semibold"
            >
              Read more →
            </Link>
            <p className="text-deadlock-muted text-xs mt-3">{post.date}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
