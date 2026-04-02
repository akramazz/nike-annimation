/**
 * Base URL for API calls from the browser.
 * Leave NEXT_PUBLIC_API_URL unset for same-origin (Vercel full-stack).
 * Set it when the Next.js frontend calls a separate backend (e.g. Railway).
 */
export function getPublicApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (!raw) return "";
  return raw.replace(/\/$/, "");
}

/** Build an absolute or same-origin path for fetch() from client components. */
export function apiUrl(path: string): string {
  const base = getPublicApiBaseUrl();
  const p = path.startsWith("/") ? path : `/${path}`;
  if (!base) return p;
  return `${base}${p}`;
}
