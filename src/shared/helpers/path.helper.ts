/**
 * Join multiple path segments into a single normalized path.
 * Uses forward slashes.
 */
export function joinPaths(...segments: string[]): string {
  return segments
    .filter((s) => s.length > 0)
    .join("/")
    .replace(/\/+/g, "/");
}

/**
 * Convert a file path to a URL-safe path.
 * Strips extension, replaces spaces, and lowercases.
 */
export function toUrlPath(filePath: string): string {
  return filePath
    .replace(/\\/g, "/")
    .replace(/\.md$/i, "")
    .replace(/\.markdown$/i, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
}

/**
 * Normalize a file path: backslashes → forward slashes,
 * remove trailing slash, collapse double slashes.
 */
export function normalizePath(path: string): string {
  return path
    .replace(/\\/g, "/")
    .replace(/\/+/g, "/")
    .replace(/\/$/, "");
}

/**
 * Extract the parent directory path from a file path.
 * Returns empty string if there is no parent.
 */
export function parentDir(filePath: string): string {
  const normalized = normalizePath(filePath);
  const lastSlash = normalized.lastIndexOf("/");
  if (lastSlash === -1) {
    return "";
  }
  return normalized.slice(0, lastSlash);
}

/**
 * Determine if a path is absolute (starts with / or a drive letter).
 */
export function isAbsolutePath(filePath: string): boolean {
  return (
    filePath.startsWith("/") || /^[A-Za-z]:[/\\]/.test(filePath)
  );
}
