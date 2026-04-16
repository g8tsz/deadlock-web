"use client";

import { useRef, useState } from "react";
import TurnstileField from "@/components/TurnstileField";

type FormState = {
  name: string;
  company: string;
  email: string;
  message: string;
};

const empty: FormState = { name: "", company: "", email: "", message: "" };

const needsTurnstileWidget = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim());

export default function SupportForm() {
  const hpRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setErrorMsg("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();
    const company = form.company.trim();
    const hp = hpRef.current?.value?.trim() ?? "";

    if (hp) {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
      return;
    }

    if (!name || !email || !message) {
      setStatus("error");
      setErrorMsg("Please fill in your name, email, and a message.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
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
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          website_url: "",
          ...(company ? { company } : {}),
          ...(turnstileToken ? { turnstileToken } : {}),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong. Try Discord or email us later.");
        setTurnstileToken(null);
        setTurnstileKey((k) => k + 1);
        return;
      }

      setStatus("success");
      setForm(empty);
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
    <form className="relative space-y-4" onSubmit={handleSubmit} noValidate>
      <input
        ref={hpRef}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px overflow-hidden opacity-0"
      />
      <input
        type="text"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        placeholder="Name"
        aria-label="Name"
        required
        disabled={submitting}
        className="w-full rounded-lg border border-deadlock-brown bg-deadlock-surface px-4 py-3 text-white placeholder-deadlock-muted focus:border-deadlock-gold focus:outline-none disabled:opacity-60"
      />
      <input
        type="text"
        value={form.company}
        onChange={(e) => update("company", e.target.value)}
        placeholder="Company or school (optional)"
        aria-label="Company or school"
        disabled={submitting}
        className="w-full rounded-lg border border-deadlock-brown bg-deadlock-surface px-4 py-3 text-white placeholder-deadlock-muted focus:border-deadlock-gold focus:outline-none disabled:opacity-60"
      />
      <input
        type="email"
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        placeholder="Email"
        aria-label="Email"
        required
        disabled={submitting}
        className="w-full rounded-lg border border-deadlock-brown bg-deadlock-surface px-4 py-3 text-white placeholder-deadlock-muted focus:border-deadlock-gold focus:outline-none disabled:opacity-60"
      />
      <textarea
        value={form.message}
        onChange={(e) => update("message", e.target.value)}
        placeholder="Message"
        aria-label="Message"
        rows={4}
        required
        disabled={submitting}
        className="w-full rounded-lg border border-deadlock-brown bg-deadlock-surface px-4 py-3 text-white placeholder-deadlock-muted focus:border-deadlock-gold focus:outline-none resize-none disabled:opacity-60"
      />

      <TurnstileField
        resetKey={turnstileKey}
        onToken={(t) => setTurnstileToken(t)}
        onExpire={() => setTurnstileToken(null)}
      />

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-lg bg-deadlock-gold py-3 font-semibold text-deadlock-dark hover:bg-deadlock-gold-light transition disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Get in touch"}
      </button>

      {status === "success" && (
        <div
          role="status"
          className="rounded-lg border border-deadlock-gold/40 bg-deadlock-gold/10 px-4 py-3 text-sm text-deadlock-cream"
        >
          Thanks for reaching out — we&apos;ll get back to you soon. For a faster response, you can also ping us in{" "}
          <a
            href="https://discord.gg/college-deadlock"
            target="_blank"
            rel="noopener noreferrer"
            className="text-deadlock-gold hover:text-deadlock-gold-light font-semibold"
          >
            Discord
          </a>
          .
        </div>
      )}
      {status === "error" && (
        <p role="alert" className="text-sm text-red-400">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
