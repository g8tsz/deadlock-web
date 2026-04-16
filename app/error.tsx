"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Page error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 bg-deadlock-dark text-deadlock-cream">
      <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
      <p className="text-deadlock-muted text-center max-w-md mb-6">
        The page couldn&apos;t load. If you just set up the project, run{" "}
        <code className="bg-deadlock-card px-2 py-1 rounded text-deadlock-gold text-sm">
          npx prisma db push
        </code>{" "}
        and{" "}
        <code className="bg-deadlock-card px-2 py-1 rounded text-deadlock-gold text-sm">
          npx prisma db seed
        </code>{" "}
        in the project folder, then refresh.
      </p>
      <button
        onClick={reset}
        className="rounded-lg bg-deadlock-gold px-6 py-3 font-semibold text-deadlock-dark hover:bg-deadlock-gold-light transition"
      >
        Try again
      </button>
      <a href="/" className="mt-4 text-deadlock-gold hover:text-deadlock-gold-light text-sm">
        Back to home
      </a>
    </div>
  );
}
