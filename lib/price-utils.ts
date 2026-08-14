export function formatPriceDA(price: number): string {
  const safe = Math.max(0, Number(price) || 0);
  return `${safe.toFixed(2)} DA`;
}

export function formatPriceDANoDecimals(price: number): string {
  const safe = Math.max(0, Number(price) || 0);
  return `${Math.round(safe)} DA`;
}
