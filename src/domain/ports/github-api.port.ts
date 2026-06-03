import type {
  AuthResult,
  RepoInfo,
  PagesInfo,
  GitFileEntry,
  GitPushResult,
} from "../../types/github.types";

/**
 * Port interface for GitHub API operations.
 *
 * Defines the contract that the GitHub domain services implement
 * and that the Publisher domain service depends on.
 *
 * This enables parallel development of Phase 4 (GitHub) and Phase 5 (Publisher):
 *   - Phase 4: implements this interface
 *   - Phase 5: depends on this interface via DI
 */
export interface GitHubApiPort {
  /**
   * Validate a Personal Access Token by calling GET /user.
   * Returns the authenticated username if valid.
   */
  validateToken(token: string): Promise<AuthResult>;

  /**
   * Ensure a GitHub repository exists.
   * Creates it if it doesn't exist.
   */
  ensureRepoExists(
    token: string,
    owner: string,
    repo: string,
  ): Promise<RepoInfo>;

  /**
   * Push files to a GitHub repository branch using the Git Tree/Blob API.
   * Single commit containing all file changes.
   */
  pushFiles(
    token: string,
    owner: string,
    repo: string,
    branch: string,
    files: GitFileEntry[],
    message: string,
  ): Promise<GitPushResult>;

  /**
   * Delete files from a GitHub repository branch.
   * Single commit with file deletions.
   */
  deleteFiles(
    token: string,
    owner: string,
    repo: string,
    branch: string,
    filePaths: string[],
    message: string,
  ): Promise<GitPushResult>;

  /**
   * Enable GitHub Pages for a repository.
   */
  enablePages(
    token: string,
    owner: string,
    repo: string,
    branch?: string,
  ): Promise<void>;

  /**
   * Get the GitHub Pages deployment status and URL.
   */
  getPagesStatus(
    token: string,
    owner: string,
    repo: string,
  ): Promise<PagesInfo>;
}
