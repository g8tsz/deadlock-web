"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    if (!looksLikeEmail) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Try again or join us on Discord.");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
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
          disabled={submitting}
          className="flex-1 rounded border border-deadlock-brown bg-deadlock-surface px-3 py-2 text-sm text-white placeholder-deadlock-muted focus:border-deadlock-gold focus:outline-none disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-deadlock-gold px-4 py-2 text-sm font-semibold text-deadlock-dark hover:bg-deadlock-gold-light transition disabled:opacity-60"
        >
          {submitting ? "…" : "Sign up"}
        </button>
      </div>
      {status === "success" && (
        <p className="text-xs text-deadlock-gold" role="status">
          Thanks! You&apos;re on the list — we&apos;ll be in touch.
        </p>
      )}
      {status === "error" && (
        <p className="text-xs text-red-400" role="alert">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
