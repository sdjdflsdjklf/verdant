/**
 * GitHub authentication result.
 */
export interface AuthResult {
  valid: boolean;
  username?: string;
  error?: string;
}

/**
 * GitHub repository information.
 */
export interface RepoInfo {
  name: string;
  owner: string;
  fullName: string;
  url: string;
  defaultBranch: string;
  exists: boolean;
}

/**
 * GitHub Pages deployment status.
 */
export interface PagesInfo {
  enabled: boolean;
  url: string;
  status: "built" | "building" | "errored" | null;
}

/**
 * A file to be committed via Git Tree/Blob API.
 */
export interface GitFileEntry {
  path: string;
  content: string;
  /** "blob" for files */
  mode: "100644";
  type: "blob";
}

/**
 * Result of a git push operation.
 */
export interface GitPushResult {
  success: boolean;
  commitSha?: string;
  error?: string;
}

/**
 * Owner type for GitHub repos.
 */
export type RepoOwnerType = "user" | "org";
