"use client";

import { useEffect } from "react";
import "./globals.css";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Root error:", error);
  }, [error]);

  return (
    <html lang="en" className="bg-[#1a120b] text-[#f5f0e8]">
      <body className="min-h-screen flex flex-col items-center justify-center px-4 antialiased">
        <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-[#c4b8a8] text-center max-w-md text-sm mb-6">
          A critical error occurred. You can try again or reach us on Discord.
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-lg bg-[#c9a227] px-6 py-3 text-sm font-semibold text-[#1a120b] hover:brightness-110 transition"
        >
          Try again
        </button>
        <a
          href="https://discord.gg/college-deadlock"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 text-sm text-[#c9a227] hover:brightness-110"
        >
          College Deadlock on Discord
        </a>
      </body>
    </html>
  );
}
