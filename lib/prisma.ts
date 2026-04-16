import path from "node:path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

/** Resolve relative SQLite paths so Prisma works on Windows regardless of cwd. */
function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL ?? "";
  if (!url.trim()) return "";
  if (url.startsWith("file:./") || url.startsWith("file:.")) {
    const relative = url.replace(/^file:\.?\/?/, "").replace(/\//g, path.sep);
    const absolute = path.join(process.cwd(), relative);
    return `file:${absolute.replace(/\\/g, "/")}`;
  }
  return url;
}

const databaseUrl = getDatabaseUrl();

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
