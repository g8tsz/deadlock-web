"use client";

import { useState } from "react";

type FormState = {
  name: string;
  company: string;
  email: string;
  message: string;
};

const empty: FormState = { name: "", company: "", email: "", message: "" };

export default function SupportForm() {
  const [form, setForm] = useState<FormState>(empty);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (status !== "idle") {
      setStatus("idle");
      setErrorMsg("");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

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

    setStatus("success");
    setForm(empty);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <input
        type="text"
        value={form.name}
        onChange={(e) => update("name", e.target.value)}
        placeholder="Name"
        aria-label="Name"
        required
        className="w-full rounded-lg border border-deadlock-brown bg-deadlock-surface px-4 py-3 text-white placeholder-deadlock-muted focus:border-deadlock-gold focus:outline-none"
      />
      <input
        type="text"
        value={form.company}
        onChange={(e) => update("company", e.target.value)}
        placeholder="Company or school (optional)"
        aria-label="Company or school"
        className="w-full rounded-lg border border-deadlock-brown bg-deadlock-surface px-4 py-3 text-white placeholder-deadlock-muted focus:border-deadlock-gold focus:outline-none"
      />
      <input
        type="email"
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        placeholder="Email"
        aria-label="Email"
        required
        className="w-full rounded-lg border border-deadlock-brown bg-deadlock-surface px-4 py-3 text-white placeholder-deadlock-muted focus:border-deadlock-gold focus:outline-none"
      />
      <textarea
        value={form.message}
        onChange={(e) => update("message", e.target.value)}
        placeholder="Message"
        aria-label="Message"
        rows={4}
        required
        className="w-full rounded-lg border border-deadlock-brown bg-deadlock-surface px-4 py-3 text-white placeholder-deadlock-muted focus:border-deadlock-gold focus:outline-none resize-none"
      />
      <button
        type="submit"
        className="w-full rounded-lg bg-deadlock-gold py-3 font-semibold text-deadlock-dark hover:bg-deadlock-gold-light transition"
      >
        Get in touch
      </button>

      {status === "success" && (
        <div
          role="status"
          className="rounded-lg border border-deadlock-gold/40 bg-deadlock-gold/10 px-4 py-3 text-sm text-deadlock-cream"
        >
          Thanks for reaching out — we&apos;ll get back to you soon. For a faster
          response, you can also ping us in{" "}
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
