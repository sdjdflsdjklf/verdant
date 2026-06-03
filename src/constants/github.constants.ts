/** GitHub API base URL */
export const GITHUB_API_BASE = "https://api.github.com";

/** Default branch for new repos */
export const DEFAULT_GIT_BRANCH = "main";

/** Git file modes */
export const GIT_FILE_MODE = "100644" as const;
export const GIT_BLOB_TYPE = "blob" as const;
export const GIT_TREE_TYPE = "tree" as const;

/** Commit messages */
export const COMMIT_MSG_INITIAL = "feat: initialize Obsidian Garden site";
export const COMMIT_MSG_UPDATE = "chore: update garden";
export const COMMIT_MSG_REMOVE = "chore: remove files from garden";

/** Required GitHub API scopes (for documentation) */
export const REQUIRED_SCOPES = ["repo", "public_repo"] as const;

/* ════════════════════════════════════════════
   OAuth Device Flow
   ════════════════════════════════════════════ */

/** GitHub OAuth Device Flow — token endpoint (for polling) */
export const GITHUB_DEVICE_TOKEN_URL = "https://github.com/login/oauth/access_token";

/** GitHub OAuth Device Flow — device code endpoint */
export const GITHUB_DEVICE_CODE_URL = "https://github.com/login/device/code";

/**
 * GitHub OAuth App Client ID.
 *
 * IMPORTANT: Replace this with your own registered OAuth App's client ID.
 * To register: GitHub.com → Settings → Developer settings → OAuth Apps → New OAuth App
 *   - Application name: Obsidian Garden
 *   - Homepage URL: https://obsidian-garden.dev (or your site)
 *   - Authorization callback URL: http://localhost (not used by Device Flow)
 *
 * The Client ID is public and safe to embed in the plugin.
 */
export const GITHUB_CLIENT_ID = "Ov23liL7qyFM8Mw3FtMw";
