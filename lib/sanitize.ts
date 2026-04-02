export function clampStr(value: unknown, maxLen: number): string {
  const s = String(value ?? "").trim();
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen);
}

export function parsePositiveInt(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : parseInt(String(value), 10);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return Math.floor(n);
}

export function parsePrice(value: unknown): number {
  const n = typeof value === "number" ? value : parseFloat(String(value));
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.round(n * 100) / 100;
}
