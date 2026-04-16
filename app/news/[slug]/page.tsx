import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsPostBySlug, getAllNewsSlugs, newsPosts } from "@/lib/news-posts";
import { getSiteUrl } from "@/lib/site";

export function generateStaticParams() {
  return getAllNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = getNewsPostBySlug(params.slug);
  if (!post) return { title: "News" };
  const base = getSiteUrl();
  return {
    title: post.title,
    description: post.excerpt.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt.slice(0, 200),
      url: `${base}/news/${post.slug}`,
      type: "article",
    },
  };
}

export default function NewsArticlePage({ params }: { params: { slug: string } }) {
  const post = getNewsPostBySlug(params.slug);
  if (!post) notFound();

  const idx = newsPosts.findIndex((p) => p.slug === params.slug);
  const prev = idx > 0 ? newsPosts[idx - 1] : null;
  const next = idx < newsPosts.length - 1 ? newsPosts[idx + 1] : null;

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs font-semibold uppercase tracking-wider text-deadlock-gold mb-1">{post.category}</p>
      <p className="text-deadlock-muted text-xs mb-4">{post.author}</p>
      <h1 className="text-3xl font-bold text-white mb-6">{post.title}</h1>
      <p className="text-deadlock-muted text-sm mb-8">{post.date}</p>
      <div className="max-w-none">
        <p className="text-deadlock-muted leading-relaxed whitespace-pre-wrap">{post.body}</p>
      </div>

      <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-deadlock-brown pt-8">
        <div className="flex flex-wrap gap-4 text-sm">
          {prev && (
            <Link
              href={`/news/${prev.slug}`}
              className="text-deadlock-gold hover:text-deadlock-gold-light font-semibold"
            >
              ← {prev.title}
            </Link>
          )}
          {next && (
            <Link
              href={`/news/${next.slug}`}
              className="text-deadlock-gold hover:text-deadlock-gold-light font-semibold"
            >
              {next.title} →
            </Link>
          )}
        </div>
        <Link href="/news" className="text-deadlock-muted hover:text-deadlock-gold text-sm">
          All news
        </Link>
      </div>
    </article>
  );
}
