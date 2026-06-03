/**
 * Per-file cache entry.
 */
export interface CacheFileEntry {
  /** SHA256 hash of file content */
  hash: string;
  /** File size in bytes */
  size: number;
  /** Last modified timestamp (ms) */
  lastModified: number;
}

/**
 * Publish cache — stored as JSON in the plugin data directory.
 */
export interface PublishCache {
  version: number;
  lastPublished: string;
  /** Relative path → file info */
  files: Record<string, CacheFileEntry>;
  siteConfig: {
    repo: string;
    branch: string;
    domain?: string;
  };
}
