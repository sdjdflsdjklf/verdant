/** Default date format pattern tokens. */
type DateToken = "YYYY" | "MM" | "DD" | "HH" | "mm" | "ss";

/**
 * Format a Date object according to a token-based pattern.
 *
 * Tokens:
 * - YYYY — 4-digit year
 * - MM   — 2-digit month (zero-padded)
 * - DD   — 2-digit day (zero-padded)
 * - HH   — 2-digit hours (zero-padded, 24h)
 * - mm   — 2-digit minutes (zero-padded)
 * - ss   — 2-digit seconds (zero-padded)
 *
 * @example formatDate(new Date(), "YYYY-MM-DD") → "2026-05-18"
 */
export function formatDate(date: Date, format: string = "YYYY-MM-DD"): string {
  const tokens: Record<DateToken, string> = {
    YYYY: String(date.getFullYear()),
    MM: String(date.getMonth() + 1).padStart(2, "0"),
    DD: String(date.getDate()).padStart(2, "0"),
    HH: String(date.getHours()).padStart(2, "0"),
    mm: String(date.getMinutes()).padStart(2, "0"),
    ss: String(date.getSeconds()).padStart(2, "0"),
  };

  let result = format;
  for (const [token, value] of Object.entries(tokens)) {
    result = result.replaceAll(token, value);
  }
  return result;
}

/**
 * Format a Date as ISO-8601 short date string (YYYY-MM-DD).
 */
export function toISOShort(date: Date): string {
  return formatDate(date, "YYYY-MM-DD");
}

/**
 * Format a Date as a human-readable relative time string (e.g. "2 hours ago").
 */
export function toRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();

  if (diffMs < 0) {
    return "in the future";
  }

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return seconds <= 5 ? "just now" : `${seconds} seconds ago`;
  }
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  }
  if (hours < 24) {
    return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  }
  if (days < 7) {
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  }
  if (weeks < 5) {
    return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;
  }
  if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""} ago`;
  }
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

/**
 * Check whether a value is a valid Date instance.
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime());
}
