/** Markdown file extensions (case-insensitive). */
const MARKDOWN_EXTENSIONS = new Set([".md", ".markdown", ".mdown", ".mdx"]);

/**
 * Returns the file extension (lowercased) including the dot.
 * Returns empty string if no extension.
 */
export function getExtension(filePath: string): string {
  const dotIndex = filePath.lastIndexOf(".");
  if (dotIndex === -1) {
    return "";
  }
  const slashIndex = Math.max(
    filePath.lastIndexOf("/"),
    filePath.lastIndexOf("\\"),
  );
  if (dotIndex < slashIndex) {
    return "";
  }
  return filePath.slice(dotIndex).toLowerCase();
}

/**
 * Strips the file extension (if any) from a path.
 */
export function stripExtension(filePath: string): string {
  const ext = getExtension(filePath);
  if (!ext) {
    return filePath;
  }
  return filePath.slice(0, -ext.length);
}

/**
 * Sanitize a file name for use in URLs and file systems.
 * Replaces spaces, special characters with hyphens.
 */
export function sanitizeFileName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fff_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Check whether a file path points to a markdown file.
 */
export function isMarkdownFile(filePath: string): boolean {
  return MARKDOWN_EXTENSIONS.has(getExtension(filePath));
}

/**
 * Convert an absolute path to a relative path given a base directory.
 * Assumes both paths use forward slashes.
 */
export function toRelativePath(absolutePath: string, basePath: string): string {
  const normalizedAbs = absolutePath.replace(/\\/g, "/");
  const normalizedBase = basePath.replace(/\\/g, "/").replace(/\/$/, "");
  if (!normalizedAbs.startsWith(normalizedBase + "/")) {
    return normalizedAbs;
  }
  return normalizedAbs.slice(normalizedBase.length + 1);
}
