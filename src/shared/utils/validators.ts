const GITHUB_TOKEN_MIN_LENGTH = 30;

/** Valid GitHub token prefixes */
const GITHUB_TOKEN_PREFIXES = ["ghp_", "github_pat_", "gho_", "ghs_", "ghr_"];

/** Regex matching Obsidian vault-safe characters for file names */
const SAFE_NAME_REGEX = /^[a-zA-Z0-9_\-\u4e00-\u9fff\s.]+$/;

/**
 * Check if a value is a non-empty string.
 * Type guard for `string`.
 */
export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * Validate a GitHub Personal Access Token format.
 * Does NOT call the API — only checks format.
 */
export function isValidGitHubToken(token: string): boolean {
  if (typeof token !== "string") {
    return false;
  }
  if (token.length < GITHUB_TOKEN_MIN_LENGTH) {
    return false;
  }
  const hasValidPrefix = GITHUB_TOKEN_PREFIXES.some((prefix: string): boolean => token.startsWith(prefix));
  if (!hasValidPrefix) {
    return false;
  }
  return /^[a-zA-Z0-9_]+$/.test(token);
}

/**
 * Check if a string looks like a valid URL.
 */
export function isValidUrl(url: string): boolean {
  if (typeof url !== "string") {
    return false;
  }
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Validate that a string is a safe file/note name.
 * Allows letters, digits, hyphens, underscores, spaces, dots, and CJK characters.
 */
export function isSafeFileName(name: string): boolean {
  return SAFE_NAME_REGEX.test(name);
}

/**
 * Validate an email address format (basic).
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Ensure a value is within numeric bounds.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
