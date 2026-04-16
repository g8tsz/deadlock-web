/**
 * Simple sliding-window rate limiter (in-memory). Best-effort on serverless
 * (each instance has its own window). Combine with Discord webhook + captcha if abused.
 */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 8;

const buckets = new Map<string, number[]>();

function prune(key: string, now: number) {
  const arr = buckets.get(key);
  if (!arr) return;
  const cut = arr.filter((t) => now - t < WINDOW_MS);
  if (cut.length === 0) buckets.delete(key);
  else buckets.set(key, cut);
}

/** Returns true if request is allowed, false if rate limited. */
export function allowFormSubmit(key: string): boolean {
  const now = Date.now();
  prune(key, now);
  const arr = buckets.get(key) ?? [];
  if (arr.length >= MAX_HITS) return false;
  arr.push(now);
  buckets.set(key, arr);
  return true;
}
