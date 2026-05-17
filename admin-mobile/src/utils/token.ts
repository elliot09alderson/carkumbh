/** Normalize QR / manual input to a 6-character booking token (A–Z, 0–9). */
export function normalizeTokenInput(raw: string): string {
  return String(raw).trim().toUpperCase().replace(/\s+/g, '');
}

/**
 * Accepts raw QR payload: plain token, URL with ?token= or last path segment.
 */
export function extractTokenFromPayload(data: string): string | null {
  const trimmed = String(data).trim();
  if (!trimmed) return null;

  const wordMatch = trimmed.match(/\b([A-Z0-9]{6})\b/i);
  if (wordMatch) return wordMatch[1].toUpperCase();

  try {
    const u = new URL(trimmed);
    const q = u.searchParams.get('token');
    if (q && /^[A-Z0-9]{6}$/i.test(q)) return q.toUpperCase();
    const parts = u.pathname.split('/').filter(Boolean);
    const last = parts[parts.length - 1];
    if (last && /^[A-Z0-9]{6}$/i.test(last)) return last.toUpperCase();
  } catch {
    /* not a URL */
  }

  const compact = normalizeTokenInput(trimmed);
  if (/^[A-Z0-9]{6}$/.test(compact)) return compact;

  return null;
}
