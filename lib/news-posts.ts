export type NewsPost = {
  slug: string;
  title: string;
  category: string;
  author: string;
  date: string;
  excerpt: string;
  body: string;
};

export const newsPosts: NewsPost[] = [
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
    body: "The first matches of College Deadlock have kicked off. 16 teams compete to win a portion of the $5,000 prize pool over a seven-week season and one week of playoffs. Each of the 16 teams play games within their group of 8 in a best-of-three round robin.",
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

export function getNewsPostBySlug(slug: string): NewsPost | undefined {
  return newsPosts.find((p) => p.slug === slug);
}

export function getAllNewsSlugs(): string[] {
  return newsPosts.map((p) => p.slug);
}
