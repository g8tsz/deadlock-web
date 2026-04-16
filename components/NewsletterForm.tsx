"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!looksLikeEmail) {
      setStatus("error");
      return;
    }
    setStatus("success");
    setEmail("");
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit} noValidate>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status !== "idle") setStatus("idle");
          }}
          placeholder="Enter your email"
          aria-label="Email address"
          className="flex-1 rounded border border-deadlock-brown bg-deadlock-surface px-3 py-2 text-sm text-white placeholder-deadlock-muted focus:border-deadlock-gold focus:outline-none"
        />
        <button
          type="submit"
          className="rounded bg-deadlock-gold px-4 py-2 text-sm font-semibold text-deadlock-dark hover:bg-deadlock-gold-light transition"
        >
          Sign up
        </button>
      </div>
      {status === "success" && (
        <p className="text-xs text-deadlock-gold" role="status">
          Thanks! You&apos;re on the list — we&apos;ll be in touch.
        </p>
      )}
      {status === "error" && (
        <p className="text-xs text-red-400" role="alert">
          Please enter a valid email address.
        </p>
      )}
    </form>
  );
}
