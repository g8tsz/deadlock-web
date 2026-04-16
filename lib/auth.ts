import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

const discordId = process.env.DISCORD_CLIENT_ID;
const discordSecret = process.env.DISCORD_CLIENT_SECRET;
const hasDatabase = Boolean(process.env.DATABASE_URL?.trim());

export const authOptions: NextAuthOptions = {
  adapter: hasDatabase ? PrismaAdapter(prisma) : undefined,
  providers: [
    ...(discordId && discordSecret
      ? [
          DiscordProvider({
            clientId: discordId,
            clientSecret: discordSecret,
            authorization: { params: { scope: "identify email" } },
          }),
        ]
      : []),
  ],
  callbacks: {
    session({ session, user, token }) {
      if (session.user) {
        const u = user ?? token;
        session.user.name = u?.name ?? undefined;
        session.user.email = u?.email ?? undefined;
        session.user.image = u?.image ?? (u as { picture?: string })?.picture ?? undefined;
        (session.user as { id?: string }).id = u?.id ?? token?.sub ?? "";
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },
  },
  pages: {
    signIn: "/",
  },
  session: {
    strategy: hasDatabase ? "database" : "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
