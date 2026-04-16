"use client";

import { useRef, useState } from "react";
import TurnstileField from "@/components/TurnstileField";

const needsTurnstileWidget = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim());

export default function NewsletterForm() {
  const hpRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = email.trim();
    const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
    const hp = hpRef.current?.value?.trim() ?? "";

    if (hp) {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
      return;
    }

    if (!looksLikeEmail) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (needsTurnstileWidget && !turnstileToken) {
      setStatus("error");
      setErrorMsg("Complete the security check below the form.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: trimmed,
          website_url: "",
          ...(turnstileToken ? { turnstileToken } : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Try again or join us on Discord.");
        setTurnstileToken(null);
        setTurnstileKey((k) => k + 1);
        return;
      }

      setStatus("success");
      setEmail("");
      setTurnstileToken(null);
      setTurnstileKey((k) => k + 1);
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Check your connection and try again.");
      setTurnstileToken(null);
      setTurnstileKey((k) => k + 1);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="relative flex flex-col gap-2" onSubmit={handleSubmit} noValidate>
      <input
        ref={hpRef}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
      />
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
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
          className="rounded bg-deadlock-gold px-4 py-2 text-sm font-semibold text-deadlock-dark hover:bg-deadlock-gold-light transition disabled:opacity-60 sm:shrink-0"
        >
          {submitting ? "…" : "Sign up"}
        </button>
      </div>

      <TurnstileField
        resetKey={turnstileKey}
        onToken={(t) => setTurnstileToken(t)}
        onExpire={() => setTurnstileToken(null)}
      />

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
