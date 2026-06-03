import type { HttpClientPort, LoggerPort, CachePort } from "../ports";
import type { HttpResponse } from "../ports/http-client.port";
import type {
  RepoInfo,
  GitFileEntry,
  GitPushResult,
} from "../../types/github.types";
import { GITHUB_API_BASE, GIT_FILE_MODE, GIT_BLOB_TYPE } from "../../constants/github.constants";
import { GithubRepoService } from "./github-repo.service";

function createHttpMock(): jest.Mocked<HttpClientPort> {
  return {
    request: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };
}

function createLoggerMock(): jest.Mocked<LoggerPort> {
  return {
    setLevel: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}

function createCacheMock(): jest.Mocked<CachePort> {
  return {
    read: jest.fn(),
    write: jest.fn(),
    clear: jest.fn(),
  };
}

const TOKEN = "ghp_test123";
const OWNER = "testuser";
const REPO = "my-garden";
const BRANCH = "main";
describe("GithubRepoService", (): void => {
  let http: jest.Mocked<HttpClientPort>;
  let logger: jest.Mocked<LoggerPort>;
  let cache: jest.Mocked<CachePort>;
  let service: GithubRepoService;

  beforeEach((): void => {
    jest.restoreAllMocks();
    http = createHttpMock();
    logger = createLoggerMock();
    cache = createCacheMock();
    cache.read.mockResolvedValue(null);
    service = new GithubRepoService(http, cache, logger);
  });

  describe("ensureRepoExists", (): void => {
    it("should return repo info when repo already exists", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 200,
        headers: {},
        data: {
          name: REPO,
          full_name: `${OWNER}/${REPO}`,
          html_url: `https://github.com/${OWNER}/${REPO}`,
          default_branch: "main",
          owner: { login: OWNER },
        },
      } as HttpResponse<Record<string, unknown>>);

      const result: RepoInfo = await service.ensureRepoExists(
        TOKEN,
        OWNER,
        REPO,
      );

      expect(result.exists).toBe(true);
      expect(result.name).toBe(REPO);
      expect(result.owner).toBe(OWNER);
      expect(result.defaultBranch).toBe("main");
    });

    it("should create repo when it does not exist", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 404,
        headers: {},
        data: { message: "Not Found" },
      } as HttpResponse<Record<string, unknown>>);

      http.post.mockResolvedValue({
        status: 201,
        headers: {},
        data: {
          name: REPO,
          full_name: `${OWNER}/${REPO}`,
          html_url: `https://github.com/${OWNER}/${REPO}`,
          default_branch: "main",
          owner: { login: OWNER },
        },
      } as HttpResponse<Record<string, unknown>>);

      const result: RepoInfo = await service.ensureRepoExists(
        TOKEN,
        OWNER,
        REPO,
      );

      expect(result.exists).toBe(true);
      expect(http.post).toHaveBeenCalledWith(
        `${GITHUB_API_BASE}/user/repos`,
        { name: REPO, auto_init: true },
        expect.any(Object),
      );
    });

    it("should return not-found info when creation fails", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 404,
        headers: {},
        data: { message: "Not Found" },
      } as HttpResponse<Record<string, unknown>>);

      http.post.mockResolvedValue({
        status: 422,
        headers: {},
        data: { message: "Validation error" },
      } as HttpResponse<Record<string, unknown>>);

      const result: RepoInfo = await service.ensureRepoExists(
        TOKEN,
        OWNER,
        REPO,
      );

      expect(result.exists).toBe(false);
    });

    it("should handle network errors", async (): Promise<void> => {
      http.get.mockRejectedValue(new Error("Network failure"));

      const result: RepoInfo = await service.ensureRepoExists(
        TOKEN,
        OWNER,
        REPO,
      );

      expect(result.exists).toBe(false);
    });

    it("should handle unexpected status codes", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 500,
        headers: {},
        data: { message: "Server Error" },
      } as HttpResponse<Record<string, unknown>>);

      const result: RepoInfo = await service.ensureRepoExists(
        TOKEN,
        OWNER,
        REPO,
      );

      expect(result.exists).toBe(false);
    });

    it("should update cache when repo exists or is created", async (): Promise<void> => {
      cache.read.mockResolvedValue({
        version: 1,
        lastPublished: "",
        files: {},
        siteConfig: { repo: "", branch: "" },
      });

      http.get.mockResolvedValue({
        status: 200,
        headers: {},
        data: {
          name: REPO,
          full_name: `${OWNER}/${REPO}`,
          html_url: "",
          default_branch: "main",
          owner: { login: OWNER },
        },
      } as HttpResponse<Record<string, unknown>>);

      await service.ensureRepoExists(TOKEN, OWNER, REPO);

      expect(cache.write).toHaveBeenCalledWith(
        expect.objectContaining({
          siteConfig: { repo: `${OWNER}/${REPO}`, branch: "main" },
        }),
      );
    });

    it("should handle cache write failures gracefully", async (): Promise<void> => {
      cache.read.mockResolvedValue({
        version: 1,
        lastPublished: "",
        files: {},
        siteConfig: { repo: "", branch: "" },
      });

      http.get.mockResolvedValue({
        status: 200,
        headers: {},
        data: {
          name: REPO,
          full_name: `${OWNER}/${REPO}`,
          html_url: "",
          default_branch: "main",
          owner: { login: OWNER },
        },
      } as HttpResponse<Record<string, unknown>>);

      cache.write.mockRejectedValue(new Error("Cache write error"));

      const result: RepoInfo = await service.ensureRepoExists(
        TOKEN,
        OWNER,
        REPO,
      );

      expect(result.exists).toBe(true);
    });
  });

  describe("pushFiles", (): void => {
    const files: GitFileEntry[] = [
      {
        path: "index.html",
        content: "<h1>Hello</h1>",
        mode: GIT_FILE_MODE,
        type: GIT_BLOB_TYPE,
      },
    ];

    const commitMessage = "Update garden";

    it("should push files and return success", async (): Promise<void> => {
      // Blob creation
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "blob-sha-1", url: "" },
      } as HttpResponse<{ sha: string; url: string }>);

      // GET branch ref
      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          ref: `refs/heads/${BRANCH}`,
          node_id: "",
          url: "",
          object: { sha: "parent-commit-sha", type: "commit", url: "" },
        },
      } as HttpResponse<Record<string, unknown>>);

      // GET commit for tree sha
      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          sha: "parent-commit-sha",
          node_id: "",
          url: "",
          tree: { sha: "base-tree-sha", url: "" },
          parents: [{ sha: "parent-sha", url: "" }],
        },
      } as HttpResponse<Record<string, unknown>>);

      // POST new tree
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "new-tree-sha", url: "", tree: [], truncated: false },
      } as HttpResponse<{ sha: string; url: string; tree: unknown[]; truncated: boolean }>);

      // POST commit
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "new-commit-sha", node_id: "", url: "", tree: { sha: "", url: "" }, parents: [] },
      } as HttpResponse<Record<string, unknown>>);

      // PATCH ref
      http.patch.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {},
      } as HttpResponse<Record<string, unknown>>);

      const result: GitPushResult = await service.pushFiles(
        TOKEN,
        OWNER,
        REPO,
        BRANCH,
        files,
        commitMessage,
      );

      expect(result.success).toBe(true);
      expect(result.commitSha).toBe("new-commit-sha");
    });

    it("should return failure when blob creation fails", async (): Promise<void> => {
      http.post.mockResolvedValueOnce({
        status: 422,
        headers: {},
        data: { message: "Unprocessable" },
      } as HttpResponse<Record<string, unknown>>);

      const result: GitPushResult = await service.pushFiles(
        TOKEN,
        OWNER,
        REPO,
        BRANCH,
        files,
        commitMessage,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle branch not existing by creating from default", async (): Promise<void> => {
      const newBranch = "gh-pages";

      // Blob creation
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "blob-sha", url: "" },
      } as HttpResponse<{ sha: string; url: string }>);

      // GET branch ref — 404 (not found)
      http.get.mockResolvedValueOnce({
        status: 404,
        headers: {},
        data: { message: "Not Found" },
      } as HttpResponse<Record<string, unknown>>);

      // GET repo info for default branch
      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          name: REPO,
          full_name: `${OWNER}/${REPO}`,
          html_url: "",
          default_branch: "main",
          owner: { login: OWNER },
        },
      } as HttpResponse<Record<string, unknown>>);

      // GET default branch ref
      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          ref: `refs/heads/main`,
          node_id: "",
          url: "",
          object: { sha: "default-commit-sha", type: "commit", url: "" },
        },
      } as HttpResponse<Record<string, unknown>>);

      // GET commit for default branch tree sha
      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          sha: "default-commit-sha",
          node_id: "",
          url: "",
          tree: { sha: "base-tree-sha", url: "" },
          parents: [{ sha: "parent-sha", url: "" }],
        },
      } as HttpResponse<Record<string, unknown>>);

      // POST new tree
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "new-tree-sha", url: "", tree: [], truncated: false },
      } as HttpResponse<{ sha: string; url: string; tree: unknown[]; truncated: boolean }>);

      // POST commit
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "new-commit-sha", node_id: "", url: "", tree: { sha: "", url: "" }, parents: [] },
      } as HttpResponse<Record<string, unknown>>);

      // POST new ref (since branch is new)
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { ref: `refs/heads/${newBranch}`, node_id: "", url: "", object: { sha: "", type: "", url: "" } },
      } as HttpResponse<Record<string, unknown>>);

      const result: GitPushResult = await service.pushFiles(
        TOKEN,
        OWNER,
        REPO,
        newBranch,
        files,
        commitMessage,
      );

      expect(result.success).toBe(true);
      expect(http.post).toHaveBeenCalledWith(
        `${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/git/refs`,
        { ref: `refs/heads/${newBranch}`, sha: "new-commit-sha" },
        expect.any(Object),
      );
    });

    it("should handle errors during commit", async (): Promise<void> => {
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "blob-sha", url: "" },
      } as HttpResponse<{ sha: string; url: string }>);

      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          ref: `refs/heads/${BRANCH}`,
          node_id: "",
          url: "",
          object: { sha: "parent-commit", type: "commit", url: "" },
        },
      } as HttpResponse<Record<string, unknown>>);

      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          sha: "parent-commit",
          node_id: "",
          url: "",
          tree: { sha: "base-tree", url: "" },
          parents: [],
        },
      } as HttpResponse<Record<string, unknown>>);

      http.post.mockResolvedValueOnce({
        status: 422,
        headers: {},
        data: { message: "Tree error" },
      } as HttpResponse<Record<string, unknown>>);

      const result: GitPushResult = await service.pushFiles(
        TOKEN,
        OWNER,
        REPO,
        BRANCH,
        files,
        commitMessage,
      );

      expect(result.success).toBe(false);
    });

    it("should fail when commit retrieval fails in getBaseTree", async (): Promise<void> => {
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "blob-sha", url: "" },
      } as HttpResponse<{ sha: string; url: string }>);

      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          ref: `refs/heads/${BRANCH}`,
          node_id: "",
          url: "",
          object: { sha: "parent-commit", type: "commit", url: "" },
        },
      } as HttpResponse<Record<string, unknown>>);

      http.get.mockResolvedValueOnce({
        status: 500,
        headers: {},
        data: { message: "Server error" },
      } as HttpResponse<Record<string, unknown>>);

      const result: GitPushResult = await service.pushFiles(
        TOKEN,
        OWNER,
        REPO,
        BRANCH,
        files,
        commitMessage,
      );

      expect(result.success).toBe(false);
    });

    it("should fail when new branch base repo fetch fails", async (): Promise<void> => {
      const newBranch = "gh-pages";

      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "blob-sha", url: "" },
      } as HttpResponse<{ sha: string; url: string }>);

      http.get.mockResolvedValueOnce({
        status: 404,
        headers: {},
        data: { message: "Not Found" },
      } as HttpResponse<Record<string, unknown>>);

      http.get.mockResolvedValueOnce({
        status: 500,
        headers: {},
        data: { message: "Server error" },
      } as HttpResponse<Record<string, unknown>>);

      const result: GitPushResult = await service.pushFiles(
        TOKEN,
        OWNER,
        REPO,
        newBranch,
        files,
        commitMessage,
      );

      expect(result.success).toBe(false);
    });

    it("should handle no commits in default branch", async (): Promise<void> => {
      const newBranch = "gh-pages";

      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "blob-sha", url: "" },
      } as HttpResponse<{ sha: string; url: string }>);

      http.get.mockResolvedValueOnce({
        status: 404,
        headers: {},
        data: { message: "Not Found" },
      } as HttpResponse<Record<string, unknown>>);

      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          name: REPO,
          full_name: `${OWNER}/${REPO}`,
          html_url: "",
          default_branch: "main",
          owner: { login: OWNER },
        },
      } as HttpResponse<Record<string, unknown>>);

      // Default branch ref also not found (empty repo)
      http.get.mockResolvedValueOnce({
        status: 404,
        headers: {},
        data: { message: "Not Found" },
      } as HttpResponse<Record<string, unknown>>);

      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "orphan-tree-sha", url: "", tree: [], truncated: false },
      } as HttpResponse<{ sha: string; url: string; tree: unknown[]; truncated: boolean }>);

      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "orphan-commit-sha", node_id: "", url: "", tree: { sha: "", url: "" }, parents: [] },
      } as HttpResponse<Record<string, unknown>>);

      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { ref: `refs/heads/${newBranch}`, node_id: "", url: "", object: { sha: "", type: "", url: "" } },
      } as HttpResponse<Record<string, unknown>>);

      const result: GitPushResult = await service.pushFiles(
        TOKEN,
        OWNER,
        REPO,
        newBranch,
        files,
        commitMessage,
      );

      expect(result.success).toBe(true);
    });

    it("should fail when commit creation fails", async (): Promise<void> => {
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "blob-sha", url: "" },
      } as HttpResponse<{ sha: string; url: string }>);

      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          ref: `refs/heads/${BRANCH}`,
          node_id: "",
          url: "",
          object: { sha: "parent-commit", type: "commit", url: "" },
        },
      } as HttpResponse<Record<string, unknown>>);

      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          sha: "parent-commit",
          node_id: "",
          url: "",
          tree: { sha: "base-tree", url: "" },
          parents: [],
        },
      } as HttpResponse<Record<string, unknown>>);

      // Tree created successfully
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "new-tree-sha", url: "", tree: [], truncated: false },
      } as HttpResponse<{ sha: string; url: string; tree: unknown[]; truncated: boolean }>);

      // Commit creation fails
      http.post.mockResolvedValueOnce({
        status: 422,
        headers: {},
        data: { message: "Commit error" },
      } as HttpResponse<Record<string, unknown>>);

      const result: GitPushResult = await service.pushFiles(
        TOKEN,
        OWNER,
        REPO,
        BRANCH,
        files,
        commitMessage,
      );

      expect(result.success).toBe(false);
    });
  });

  describe("deleteFiles", (): void => {
    const filePaths: string[] = ["old-file.md", "draft.md"];
    const message = "Remove stale files";

    it("should delete files and return success", async (): Promise<void> => {
      // GET branch ref
      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          ref: `refs/heads/${BRANCH}`,
          node_id: "",
          url: "",
          object: { sha: "parent-commit", type: "commit", url: "" },
        },
      } as HttpResponse<Record<string, unknown>>);

      // GET commit for tree
      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          sha: "parent-commit",
          node_id: "",
          url: "",
          tree: { sha: "base-tree-sha", url: "" },
          parents: [],
        },
      } as HttpResponse<Record<string, unknown>>);

      // POST tree with deletions
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "new-tree-sha", url: "", tree: [], truncated: false },
      } as HttpResponse<{ sha: string; url: string; tree: unknown[]; truncated: boolean }>);

      // POST commit
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "delete-commit-sha", node_id: "", url: "", tree: { sha: "", url: "" }, parents: [] },
      } as HttpResponse<Record<string, unknown>>);

      // PATCH ref
      http.patch.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {},
      } as HttpResponse<Record<string, unknown>>);

      const result: GitPushResult = await service.deleteFiles(
        TOKEN,
        OWNER,
        REPO,
        BRANCH,
        filePaths,
        message,
      );

      expect(result.success).toBe(true);
      expect(result.commitSha).toBe("delete-commit-sha");
    });

    it("should return failure when tree creation fails", async (): Promise<void> => {
      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          ref: `refs/heads/${BRANCH}`,
          node_id: "",
          url: "",
          object: { sha: "commit-sha", type: "commit", url: "" },
        },
      } as HttpResponse<Record<string, unknown>>);

      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          sha: "commit-sha",
          node_id: "",
          url: "",
          tree: { sha: "base-tree", url: "" },
          parents: [],
        },
      } as HttpResponse<Record<string, unknown>>);

      http.post.mockResolvedValueOnce({
        status: 422,
        headers: {},
        data: { message: "Bad tree" },
      } as HttpResponse<Record<string, unknown>>);

      const result: GitPushResult = await service.deleteFiles(
        TOKEN,
        OWNER,
        REPO,
        BRANCH,
        filePaths,
        message,
      );

      expect(result.success).toBe(false);
    });

    it("should create new branch and delete files", async (): Promise<void> => {
      const newBranch = "gh-pages";

      // GET branch ref — 404 (branch does not exist)
      http.get.mockResolvedValueOnce({
        status: 404,
        headers: {},
        data: { message: "Not Found" },
      } as HttpResponse<Record<string, unknown>>);

      // GET repo info for default branch
      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          name: REPO,
          full_name: `${OWNER}/${REPO}`,
          html_url: "",
          default_branch: "main",
          owner: { login: OWNER },
        },
      } as HttpResponse<Record<string, unknown>>);

      // GET default branch ref
      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          ref: "refs/heads/main",
          node_id: "",
          url: "",
          object: { sha: "default-commit-sha", type: "commit", url: "" },
        },
      } as HttpResponse<Record<string, unknown>>);

      // GET commit for default branch tree sha
      http.get.mockResolvedValueOnce({
        status: 200,
        headers: {},
        data: {
          sha: "default-commit-sha",
          node_id: "",
          url: "",
          tree: { sha: "base-tree-sha", url: "" },
          parents: [{ sha: "parent-sha", url: "" }],
        },
      } as HttpResponse<Record<string, unknown>>);

      // POST tree
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: { sha: "new-tree-sha", url: "", tree: [], truncated: false },
      } as HttpResponse<Record<string, unknown>>);

      // POST commit
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: {
          sha: "delete-commit-sha",
          node_id: "",
          url: "",
          tree: { sha: "", url: "" },
          parents: [],
        },
      } as HttpResponse<Record<string, unknown>>);

      // POST new ref (isNewBranch=true)
      http.post.mockResolvedValueOnce({
        status: 201,
        headers: {},
        data: {
          ref: `refs/heads/${newBranch}`,
          node_id: "",
          url: "",
          object: { sha: "", type: "", url: "" },
        },
      } as HttpResponse<Record<string, unknown>>);

      const result: GitPushResult = await service.deleteFiles(
        TOKEN,
        OWNER,
        REPO,
        newBranch,
        filePaths,
        message,
      );

      expect(result.success).toBe(true);
      expect(result.commitSha).toBe("delete-commit-sha");
    });

    it("should handle non-Error thrown during delete", async (): Promise<void> => {
      http.get.mockRejectedValue("Network failure");

      const result: GitPushResult = await service.deleteFiles(
        TOKEN,
        OWNER,
        REPO,
        BRANCH,
        filePaths,
        message,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Network failure");
    });
  });

  describe("pushFiles — missing branch coverage", (): void => {
    const files: GitFileEntry[] = [
      {
        path: "index.html",
        content: "<h1>Hello</h1>",
        mode: GIT_FILE_MODE,
        type: GIT_BLOB_TYPE,
      },
    ];

    const commitMessage = "Update garden";

    it("should handle non-Error thrown during push", async (): Promise<void> => {
      http.post.mockRejectedValue("Connection lost");

      const result: GitPushResult = await service.pushFiles(
        TOKEN,
        OWNER,
        REPO,
        BRANCH,
        files,
        commitMessage,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Connection lost");
    });
  });
});
