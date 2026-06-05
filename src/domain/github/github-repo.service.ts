import { injectable, inject } from "tsyringe";
import type { HttpClientPort, LoggerPort, KeyValueStorePort } from "../ports";
import { DI_TOKENS } from "../../di/tokens";
import type {
  RepoInfo,
  GitFileEntry,
  GitPushResult,
} from "../../types/github.types";
import {
  GITHUB_API_BASE,
  GIT_FILE_MODE,
  GIT_BLOB_TYPE,
} from "../../constants/github.constants";
import type { PublishCache } from "../../types/cache.types";

const BLOB_UPLOAD_CONCURRENCY = 5;

// ── Internal response shapes (GitHub REST API) ────────────────────────

interface RefObject {
  sha: string;
  type: string;
  url: string;
}

interface GitHubRefResponse {
  ref: string;
  node_id: string;
  url: string;
  object: RefObject;
}

interface GitHubCommitResponse {
  sha: string;
  node_id: string;
  url: string;
  tree: { sha: string; url: string };
  parents: Array<{ sha: string; url: string }>;
}

interface GitHubBlobResponse {
  sha: string;
  url: string;
}

interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: Array<{
    path: string;
    mode: string;
    type: string;
    sha: string;
    url: string;
  }>;
  truncated: boolean;
}

interface GitHubRepoResponse {
  name: string;
  full_name: string;
  html_url: string;
  default_branch: string;
  owner: { login: string };
}

// ── Internal helpers ──────────────────────────────────────────────────

interface TreeEntryRequest {
  path: string;
  mode: string;
  type: string;
  sha: string | null;
}

interface BaseTreeResult {
  refSha: string;
  treeSha: string;
  isNewBranch: boolean;
}

@injectable()
export class GithubRepoService {
  private static readonly CACHE_KEY = "publish_cache";
  constructor(
    @inject(DI_TOKENS.HttpClient) private readonly httpClient: HttpClientPort,
    @inject(DI_TOKENS.KeyValueStorePort) private readonly store: KeyValueStorePort,
    @inject(DI_TOKENS.LoggerService) private readonly logger: LoggerPort,
  ) {}

  public async ensureRepoExists(
    token: string,
    owner: string,
    repo: string,
  ): Promise<RepoInfo> {
    this.logger.debug(
      "Checking if repo {owner}/{repo} exists...",
      owner,
      repo,
    );

    try {
      const getResponse = await this.httpClient.get<GitHubRepoResponse>(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
        { headers: this.authHeaders(token) },
      );

      if (getResponse.status === 200) {
        const data: GitHubRepoResponse = getResponse.data;
        const repoInfo: RepoInfo = this.toRepoInfo(data);
        this.updateCache(owner, repo, repoInfo.defaultBranch);
        this.logger.info("Repo {owner}/{repo} exists", owner, repo);
        return repoInfo;
      }

      if (getResponse.status === 404) {
        this.logger.info(
          "Repo {owner}/{repo} not found, creating...",
          owner,
          repo,
        );

        const createResponse =
          await this.httpClient.post<GitHubRepoResponse>(
            `${GITHUB_API_BASE}/user/repos`,
            { name: repo, auto_init: true },
            { headers: this.authHeaders(token) },
          );

        if (createResponse.status === 201) {
          const created: GitHubRepoResponse = createResponse.data;
          const repoInfo: RepoInfo = this.toRepoInfo(created);
          this.updateCache(owner, repo, repoInfo.defaultBranch);
          this.logger.info("Created repo {owner}/{repo}", owner, repo);
          return repoInfo;
        }

        this.logger.error(
          "Failed to create repo {owner}/{repo}: status {status}",
          owner,
          repo,
          createResponse.status,
        );
        return this.notFoundRepoInfo(owner, repo);
      }

      this.logger.error(
        "Unexpected status checking repo {owner}/{repo}: {status}",
        owner,
        repo,
        getResponse.status,
      );
      return this.notFoundRepoInfo(owner, repo);
    } catch (error) {
      this.logger.error(
        "Error ensuring repo {owner}/{repo} exists: {error}",
        owner,
        repo,
        error,
      );
      return this.notFoundRepoInfo(owner, repo);
    }
  }

  public async pushFiles(
    token: string,
    owner: string,
    repo: string,
    branch: string,
    files: GitFileEntry[],
    message: string,
  ): Promise<GitPushResult> {
    this.logger.debug(
      "Pushing {count} files to {owner}/{repo}:{branch}",
      files.length,
      owner,
      repo,
      branch,
    );

    try {
      const treeEntries: TreeEntryRequest[] = await this.createBlobs(
        token,
        owner,
        repo,
        files,
      );

      const base: BaseTreeResult = await this.getBaseTree(
        token,
        owner,
        repo,
        branch,
      );

      const newTreeSha: string = await this.postTree(
        token,
        owner,
        repo,
        base.treeSha,
        treeEntries,
      );

      const commitSha: string = await this.postCommit(
        token,
        owner,
        repo,
        message,
        newTreeSha,
        base.refSha,
      );

      await this.updateRef(token, owner, repo, branch, commitSha, base.isNewBranch);

      this.logger.info(
        "Successfully pushed {count} files to {owner}/{repo}:{branch}",
        files.length,
        owner,
        repo,
        branch,
      );
      return { success: true, commitSha };
    } catch (error) {
      this.logger.error("Failed to push files: {error}", error);
      const errorMessage: string =
        error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMessage };
    }
  }

  public async deleteFiles(
    token: string,
    owner: string,
    repo: string,
    branch: string,
    filePaths: string[],
    message: string,
  ): Promise<GitPushResult> {
    this.logger.debug(
      "Deleting {count} files from {owner}/{repo}:{branch}",
      filePaths.length,
      owner,
      repo,
      branch,
    );

    try {
      const deletionEntries: TreeEntryRequest[] = filePaths.map(
        (path: string): TreeEntryRequest => ({
          path,
          mode: GIT_FILE_MODE,
          type: GIT_BLOB_TYPE,
          sha: null,
        }),
      );

      const base: BaseTreeResult = await this.getBaseTree(
        token,
        owner,
        repo,
        branch,
      );

      const newTreeSha: string = await this.postTree(
        token,
        owner,
        repo,
        base.treeSha,
        deletionEntries,
      );

      const commitSha: string = await this.postCommit(
        token,
        owner,
        repo,
        message,
        newTreeSha,
        base.refSha,
      );

      await this.updateRef(token, owner, repo, branch, commitSha, base.isNewBranch);

      this.logger.info(
        "Successfully deleted {count} files from {owner}/{repo}:{branch}",
        filePaths.length,
        owner,
        repo,
        branch,
      );
      return { success: true, commitSha };
    } catch (error) {
      this.logger.error("Failed to delete files: {error}", error);
      const errorMessage: string =
        error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMessage };
    }
  }

  // ── Private helpers ─────────────────────────────────────────────────

  private authHeaders(token: string): Record<string, string> {
    return {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
    };
  }

  private toRepoInfo(data: GitHubRepoResponse): RepoInfo {
    return {
      name: data.name,
      owner: data.owner.login,
      fullName: data.full_name,
      url: data.html_url,
      defaultBranch: data.default_branch,
      exists: true,
    };
  }

  private notFoundRepoInfo(owner: string, repo: string): RepoInfo {
    return {
      name: repo,
      owner,
      fullName: `${owner}/${repo}`,
      url: "",
      defaultBranch: "main",
      exists: false,
    };
  }

  private async createBlobs(
    token: string,
    owner: string,
    repo: string,
    files: GitFileEntry[],
  ): Promise<TreeEntryRequest[]> {
    const results: TreeEntryRequest[] = [];
    const chunks: GitFileEntry[][] = chunkArray(files, BLOB_UPLOAD_CONCURRENCY);

    for (const chunk of chunks) {
      const chunkResults: TreeEntryRequest[] = await Promise.all(
        chunk.map(
          async (file: GitFileEntry): Promise<TreeEntryRequest> => {
            const blobResponse =
              await this.httpClient.post<GitHubBlobResponse>(
                `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/blobs`,
                { content: file.content, encoding: "utf-8" },
                { headers: this.authHeaders(token) },
              );

            if (blobResponse.status !== 201) {
              throw new Error(
                `Failed to create blob for ${file.path}: status ${blobResponse.status}`,
              );
            }

            return {
              path: file.path,
              mode: file.mode,
              type: file.type,
              sha: blobResponse.data.sha,
            } satisfies TreeEntryRequest;
          },
        ),
      );
      results.push(...chunkResults);
    }

    return results;
  }

  private async getBaseTree(
    token: string,
    owner: string,
    repo: string,
    branch: string,
  ): Promise<BaseTreeResult> {
    const refResponse = await this.httpClient.get<GitHubRefResponse>(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs/heads/${branch}`,
      { headers: this.authHeaders(token) },
    );

    if (refResponse.status === 200) {
      const refSha: string = refResponse.data.object.sha;
      const commitResponse =
        await this.httpClient.get<GitHubCommitResponse>(
          `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/commits/${refSha}`,
          { headers: this.authHeaders(token) },
        );

      if (commitResponse.status !== 200) {
        throw new Error(
          `Failed to get commit ${refSha}: status ${commitResponse.status}`,
        );
      }

      return {
        refSha,
        treeSha: commitResponse.data.tree.sha,
        isNewBranch: false,
      } satisfies BaseTreeResult;
    }

    // Branch doesn't exist — get the default branch instead
    const repoResponse = await this.httpClient.get<GitHubRepoResponse>(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}`,
      { headers: this.authHeaders(token) },
    );

    if (repoResponse.status !== 200) {
      throw new Error(
        `Failed to get repo ${owner}/${repo}: status ${repoResponse.status}`,
      );
    }

    const defaultBranch: string = repoResponse.data.default_branch;

    const defaultRefResponse = await this.httpClient.get<GitHubRefResponse>(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs/heads/${defaultBranch}`,
      { headers: this.authHeaders(token) },
    );

    if (defaultRefResponse.status !== 200) {
      // Repo has no commits yet — start from empty
      return { refSha: "", treeSha: "", isNewBranch: true } satisfies BaseTreeResult;
    }

    const defaultCommitSha: string = defaultRefResponse.data.object.sha;
    const defaultCommitResponse = await this.httpClient.get<GitHubCommitResponse>(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/commits/${defaultCommitSha}`,
      { headers: this.authHeaders(token) },
    );

    if (defaultCommitResponse.status !== 200) {
      throw new Error(
        `Failed to get commit ${defaultCommitSha}: status ${defaultCommitResponse.status}`,
      );
    }

    return {
      refSha: defaultCommitSha,
      treeSha: defaultCommitResponse.data.tree.sha,
      isNewBranch: true,
    } satisfies BaseTreeResult;
  }

  private async postTree(
    token: string,
    owner: string,
    repo: string,
    baseTreeSha: string,
    entries: TreeEntryRequest[],
  ): Promise<string> {
    const treePayload: {
      base_tree?: string;
      tree: TreeEntryRequest[];
    } = {
      tree: entries,
    };

    if (baseTreeSha !== "") {
      treePayload.base_tree = baseTreeSha;
    }

    const treeResponse = await this.httpClient.post<GitHubTreeResponse>(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/trees`,
      treePayload,
      { headers: this.authHeaders(token) },
    );

    if (treeResponse.status !== 201) {
      throw new Error(
        `Failed to create tree: status ${treeResponse.status}`,
      );
    }

    return treeResponse.data.sha;
  }

  private async postCommit(
    token: string,
    owner: string,
    repo: string,
    message: string,
    treeSha: string,
    parentSha: string,
  ): Promise<string> {
    const commitPayload: {
      message: string;
      tree: string;
      parents: string[];
    } = {
      message,
      tree: treeSha,
      parents: parentSha !== "" ? [parentSha] : [],
    };

    const commitResponse = await this.httpClient.post<GitHubCommitResponse>(
      `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/commits`,
      commitPayload,
      { headers: this.authHeaders(token) },
    );

    if (commitResponse.status !== 201) {
      throw new Error(
        `Failed to create commit: status ${commitResponse.status}`,
      );
    }

    return commitResponse.data.sha;
  }

  private updateCache(
    owner: string,
    repo: string,
    defaultBranch: string,
  ): void {
    try {
      const existing: PublishCache | undefined = this.store.get<PublishCache>(GithubRepoService.CACHE_KEY);
      if (existing !== undefined) {
        existing.siteConfig.repo = `${owner}/${repo}`;
        existing.siteConfig.branch = defaultBranch;
        this.store.set(GithubRepoService.CACHE_KEY, existing);
      }
    } catch (error) {
      this.logger.warn("Failed to update publish cache: {error}", error);
    }
  }

  private async updateRef(
    token: string,
    owner: string,
    repo: string,
    branch: string,
    commitSha: string,
    isNewBranch: boolean,
  ): Promise<void> {
    if (isNewBranch) {
      const response = await this.httpClient.post<GitHubRefResponse>(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs`,
        { ref: `refs/heads/${branch}`, sha: commitSha },
        { headers: this.authHeaders(token) },
      );

      if (response.status !== 201) {
        throw new Error(
          `Failed to create ref refs/heads/${branch}: status ${response.status}`,
        );
      }
    } else {
      const response = await this.httpClient.patch<GitHubRefResponse>(
        `${GITHUB_API_BASE}/repos/${owner}/${repo}/git/refs/heads/${branch}`,
        { sha: commitSha, force: true },
        { headers: this.authHeaders(token) },
      );

      if (response.status !== 200) {
        throw new Error(
          `Failed to update ref refs/heads/${branch}: status ${response.status}`,
        );
      }
    }
  }
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}
