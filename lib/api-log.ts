/** Structured-ish logs for API troubleshooting (visible in Vercel/host logs). */
export function logApiWarning(route: string, message: string, extra?: Record<string, unknown>) {
  const payload = { route, message, ...extra };
  console.warn("[api]", JSON.stringify(payload));
}

export function logApiError(route: string, message: string, err?: unknown) {
  const errMsg = err instanceof Error ? err.message : String(err);
  console.error("[api]", JSON.stringify({ route, message, error: errMsg }));
}
