import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { getSiteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/schedule",
    "/about",
    "/partners",
    "/news",
    "/contact",
    "/faq",
    "/signup",
    "/conferences",
    "/schools",
    "/events",
    "/season-0",
    "/season-2",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

  let schools: { slug: string }[] = [];
  let events: { slug: string }[] = [];
  try {
    [schools, events] = await Promise.all([
      prisma.school.findMany({ select: { slug: true } }),
      prisma.event.findMany({ select: { slug: true } }),
    ]);
  } catch {
    return staticRoutes;
  }

  const dynamic: MetadataRoute.Sitemap = [
    ...schools.map((s) => ({
      url: `${base}/schools/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    ...events.map((e) => ({
      url: `${base}/events/${e.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticRoutes, ...dynamic];
}
