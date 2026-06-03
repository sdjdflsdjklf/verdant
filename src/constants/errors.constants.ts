/**
 * Application error codes.
 * Convention: MODULE_REASON (uppercase, underscore-separated).
 */
export enum ErrorCode {
  // GitHub
  GITHUB_TOKEN_INVALID = "GITHUB_TOKEN_INVALID",
  GITHUB_REPO_CREATE_FAILED = "GITHUB_REPO_CREATE_FAILED",
  GITHUB_PAGES_ENABLE_FAILED = "GITHUB_PAGES_ENABLE_FAILED",
  GITHUB_PUSH_FAILED = "GITHUB_PUSH_FAILED",
  GITHUB_API_ERROR = "GITHUB_API_ERROR",

  // Publisher
  PUBLISH_NO_FILES = "PUBLISH_NO_FILES",
  PUBLISH_SSG_FAILED = "PUBLISH_SSG_FAILED",
  PUBLISH_CACHE_READ_FAILED = "PUBLISH_CACHE_READ_FAILED",
  PUBLISH_CACHE_WRITE_FAILED = "PUBLISH_CACHE_WRITE_FAILED",

  // License
  LICENSE_INVALID = "LICENSE_INVALID",
  LICENSE_EXPIRED = "LICENSE_EXPIRED",

  // Config
  CONFIG_LOAD_FAILED = "CONFIG_LOAD_FAILED",
  CONFIG_SAVE_FAILED = "CONFIG_SAVE_FAILED",

  // General
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/** Human-readable error messages */
export const ErrorMessages: Record<ErrorCode, string> = {
  [ErrorCode.GITHUB_TOKEN_INVALID]: "GitHub token is invalid or expired. Please check your settings.",
  [ErrorCode.GITHUB_REPO_CREATE_FAILED]: "Failed to create GitHub repository. Check your token permissions.",
  [ErrorCode.GITHUB_PAGES_ENABLE_FAILED]: "Failed to enable GitHub Pages. Make sure the repository exists.",
  [ErrorCode.GITHUB_PUSH_FAILED]: "Failed to push files to GitHub. Please try again.",
  [ErrorCode.GITHUB_API_ERROR]: "GitHub API error. Check your network connection and token.",
  [ErrorCode.PUBLISH_NO_FILES]: "No notes selected for publishing.",
  [ErrorCode.PUBLISH_SSG_FAILED]: "Failed to generate static site.",
  [ErrorCode.PUBLISH_CACHE_READ_FAILED]: "Failed to read publish cache.",
  [ErrorCode.PUBLISH_CACHE_WRITE_FAILED]: "Failed to write publish cache.",
  [ErrorCode.LICENSE_INVALID]: "License key is invalid.",
  [ErrorCode.LICENSE_EXPIRED]: "License key has expired.",
  [ErrorCode.CONFIG_LOAD_FAILED]: "Failed to load plugin configuration.",
  [ErrorCode.CONFIG_SAVE_FAILED]: "Failed to save plugin configuration.",
  [ErrorCode.UNKNOWN_ERROR]: "An unexpected error occurred. Please try again.",
};
