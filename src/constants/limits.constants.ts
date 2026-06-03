/** Free tier limits */
export const FREE_TIER_MAX_NOTES = 10;

/** Max file size for a single note (10 MB) */
export const MAX_NOTE_SIZE_BYTES = 10 * 1024 * 1024;

/** Max total site size (500 MB — GitHub Pages limit is 1 GB, we stay conservative) */
export const MAX_SITE_SIZE_BYTES = 500 * 1024 * 1024;

/** Timeouts */
export const GITHUB_REQUEST_TIMEOUT_MS = 30_000;
export const PUBLISH_TIMEOUT_MS = 120_000;

/** Retry */
export const MAX_RETRY_ATTEMPTS = 3;
export const RETRY_BASE_DELAY_MS = 1_000;
