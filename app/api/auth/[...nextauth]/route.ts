import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const nextAuth = NextAuth(authOptions);

async function safeHandler(
  req: Request,
  context: { params: Promise<{ nextauth: string[] }> }
) {
  try {
    return await nextAuth(req, context as unknown as { params: { nextauth: string[] } });
  } catch (err) {
    console.error("[NextAuth]", err);
    return new Response(
      JSON.stringify({ error: "Authentication error" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }
}

export const GET = (req: Request, context: { params: Promise<{ nextauth: string[] }> }) =>
  safeHandler(req, context);
export const POST = (req: Request, context: { params: Promise<{ nextauth: string[] }> }) =>
  safeHandler(req, context);
