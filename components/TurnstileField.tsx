"use client";

import { Turnstile } from "@marsidev/react-turnstile";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

type Props = {
  onToken: (token: string) => void;
  onExpire?: () => void;
  /** Bump to remount widget after a failed submit. */
  resetKey?: number;
};

export default function TurnstileField({ onToken, onExpire, resetKey = 0 }: Props) {
  if (!siteKey) return null;

  return (
    <div className="min-h-[65px]">
      <Turnstile
        key={resetKey}
        siteKey={siteKey}
        onSuccess={onToken}
        onExpire={() => {
          onExpire?.();
        }}
      />
    </div>
  );
}
