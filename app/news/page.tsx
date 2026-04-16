import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News",
  description: "College Deadlock announcements, partnerships, and season updates.",
};

const posts = [
  {
    slug: "fitgmr-partnership",
    title: "FITGMR x College Deadlock Partnership",
    category: "Informational",
    author: "Stormwarrior",
    date: "March 10, 2025",
    excerpt:
      "FITGMR and College Deadlock Launch a Game-Changing Collegiate Esports League Partnership with a Commitment to Player Health & Well-being. Get ready for a revolutionary collegiate",
    body: "FITGMR and College Deadlock have partnered to bring a game-changing collegiate esports league with a commitment to player health and well-being. Get ready for a revolutionary collegiate experience that supports both competition and wellness.",
  },
  {
    slug: "season-0-begins",
    title: "College Deadlock Season 0 Begins",
    category: "Informational",
    author: "Stormwarrior",
    date: "February 5, 2025",
    excerpt:
      "The first matches of College Deadlock kick off. 16 teams compete to win a portion of the $5,000 prize pool over a seven-week season and one week of playoffs. Each of the following 16 teams play games within their group of 8 in a best-of-three round robin.",
    body: "The first matches of College Deadlock have kicked off. 16 teams compete to win a portion of the $5,000 prize pool over a seven-week season and one week of playoffs. Each of the 16 teams play games within their group of 8 in a best-of-three round robin. No Comments.",
  },
  {
    slug: "what-is-deadlock",
    title: "What is the Game of Deadlock",
    category: "Informational",
    author: "Stormwarrior",
    date: "January 14, 2025",
    excerpt:
      "What is the game Deadlock, and why is everybody talking about it? Let's break down the fundamentals of the game and help you understand what",
    body: "What is the game Deadlock, and why is everybody talking about it? Let's break down the fundamentals of the game and help you understand what makes it one of the most talked-about titles in the space.",
  },
];

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">News and Insights</h1>
      <p className="text-deadlock-muted mb-10">Informational</p>

      <div className="space-y-10">
        {posts.map((post) => (
          <article
            key={post.slug}
            id={post.slug}
            className="border-b border-deadlock-brown pb-10 last:border-0"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-deadlock-gold mb-1">
              {post.category}
            </p>
            <p className="text-deadlock-muted text-xs mb-2">{post.author}</p>
            <h2 className="text-xl font-semibold text-white mb-3">{post.title}</h2>
            <p className="text-deadlock-muted leading-relaxed">{post.excerpt}</p>
            <Link
              href={`/news#${post.slug}`}
              className="mt-3 inline-block text-deadlock-gold hover:text-deadlock-gold-light text-sm font-semibold"
            >
              Read More »
            </Link>
            <p className="text-deadlock-muted text-xs mt-3">{post.date} No Comments</p>
          </article>
        ))}
      </div>
    </div>
  );
}
