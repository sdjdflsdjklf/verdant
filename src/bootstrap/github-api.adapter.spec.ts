import "reflect-metadata";
import type { LoggerPort } from "../domain/ports";
import type { GithubAuthService } from "../domain/github/github-auth.service";
import type { GithubRepoService } from "../domain/github/github-repo.service";
import type { GithubPagesService } from "../domain/github/github-pages.service";
import { GithubApiAdapter } from "./github-api.adapter";
import type {
  AuthResult,
  RepoInfo,
  PagesInfo,
  GitFileEntry,
  GitPushResult,
} from "../types/github.types";

describe("GithubApiAdapter", (): void => {
  let adapter: GithubApiAdapter;
  let mockLogger: jest.Mocked<LoggerPort>;
  let mockAuthService: jest.Mocked<GithubAuthService>;
  let mockRepoService: jest.Mocked<GithubRepoService>;
  let mockPagesService: jest.Mocked<GithubPagesService>;

  const TEST_TOKEN: string = "ghp_test_token";
  const TEST_OWNER: string = "test-user";
  const TEST_REPO: string = "test-repo";
  const TEST_BRANCH: string = "main";

  beforeEach((): void => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      setLevel: jest.fn(),
    } as jest.Mocked<LoggerPort>;

    mockAuthService = {
      validateToken: jest.fn(),
    } as unknown as jest.Mocked<GithubAuthService>;

    mockRepoService = {
      ensureRepoExists: jest.fn(),
      pushFiles: jest.fn(),
      deleteFiles: jest.fn(),
    } as unknown as jest.Mocked<GithubRepoService>;

    mockPagesService = {
      enablePages: jest.fn(),
      getPagesStatus: jest.fn(),
    } as unknown as jest.Mocked<GithubPagesService>;

    adapter = new GithubApiAdapter(
      mockLogger,
      mockAuthService,
      mockRepoService,
      mockPagesService,
    );
  });

  describe("validateToken", (): void => {
    it("should delegate to authService.validateToken", async (): Promise<void> => {
      const expected: AuthResult = { valid: true, username: "test-user" };
      mockAuthService.validateToken.mockResolvedValue(expected);

      const result: AuthResult = await adapter.validateToken(TEST_TOKEN);

      expect(mockLogger.debug).toHaveBeenCalledWith(
        "GithubApiAdapter.validateToken",
      );
      expect(mockAuthService.validateToken).toHaveBeenCalledWith(TEST_TOKEN);
      expect(result).toEqual(expected);
    });

    it("should propagate errors from authService", async (): Promise<void> => {
      const testError: Error = new Error("Network error");
      mockAuthService.validateToken.mockRejectedValue(testError);

      await expect(adapter.validateToken(TEST_TOKEN)).rejects.toThrow(
        testError,
      );
    });
  });

  describe("ensureRepoExists", (): void => {
    it("should delegate to repoService.ensureRepoExists", async (): Promise<void> => {
      const expected: RepoInfo = {
        name: TEST_REPO,
        owner: TEST_OWNER,
        fullName: `${TEST_OWNER}/${TEST_REPO}`,
        url: "https://github.com/test-user/test-repo",
        defaultBranch: "main",
        exists: true,
      };
      mockRepoService.ensureRepoExists.mockResolvedValue(expected);

      const result: RepoInfo = await adapter.ensureRepoExists(
        TEST_TOKEN,
        TEST_OWNER,
        TEST_REPO,
      );

      expect(mockLogger.debug).toHaveBeenCalledWith(
        "GithubApiAdapter.ensureRepoExists",
      );
      expect(mockRepoService.ensureRepoExists).toHaveBeenCalledWith(
        TEST_TOKEN,
        TEST_OWNER,
        TEST_REPO,
      );
      expect(result).toEqual(expected);
    });
  });

  describe("pushFiles", (): void => {
    it("should delegate to repoService.pushFiles", async (): Promise<void> => {
      const files: GitFileEntry[] = [
        {
          path: "index.html",
          content: "<html>",
          mode: "100644",
          type: "blob",
        },
      ];
      const message: string = "Initial publish";
      const expected: GitPushResult = { success: true, commitSha: "abc123" };
      mockRepoService.pushFiles.mockResolvedValue(expected);

      const result: GitPushResult = await adapter.pushFiles(
        TEST_TOKEN,
        TEST_OWNER,
        TEST_REPO,
        TEST_BRANCH,
        files,
        message,
      );

      expect(mockLogger.debug).toHaveBeenCalledWith(
        "GithubApiAdapter.pushFiles",
      );
      expect(mockRepoService.pushFiles).toHaveBeenCalledWith(
        TEST_TOKEN,
        TEST_OWNER,
        TEST_REPO,
        TEST_BRANCH,
        files,
        message,
      );
      expect(result).toEqual(expected);
    });
  });

  describe("deleteFiles", (): void => {
    it("should delegate to repoService.deleteFiles", async (): Promise<void> => {
      const filePaths: string[] = ["old-page.md"];
      const message: string = "Remove old page";
      const expected: GitPushResult = { success: true, commitSha: "def456" };
      mockRepoService.deleteFiles.mockResolvedValue(expected);

      const result: GitPushResult = await adapter.deleteFiles(
        TEST_TOKEN,
        TEST_OWNER,
        TEST_REPO,
        TEST_BRANCH,
        filePaths,
        message,
      );

      expect(mockLogger.debug).toHaveBeenCalledWith(
        "GithubApiAdapter.deleteFiles",
      );
      expect(mockRepoService.deleteFiles).toHaveBeenCalledWith(
        TEST_TOKEN,
        TEST_OWNER,
        TEST_REPO,
        TEST_BRANCH,
        filePaths,
        message,
      );
      expect(result).toEqual(expected);
    });
  });

  describe("enablePages", (): void => {
    it("should delegate to pagesService.enablePages", async (): Promise<void> => {
      mockPagesService.enablePages.mockResolvedValue(undefined);

      await adapter.enablePages(TEST_TOKEN, TEST_OWNER, TEST_REPO);

      expect(mockLogger.debug).toHaveBeenCalledWith(
        "GithubApiAdapter.enablePages",
      );
      expect(mockPagesService.enablePages).toHaveBeenCalledWith(
        TEST_TOKEN,
        TEST_OWNER,
        TEST_REPO,
        undefined,
      );
    });

    it("should pass branch when provided", async (): Promise<void> => {
      mockPagesService.enablePages.mockResolvedValue(undefined);
      const customBranch: string = "gh-pages";

      await adapter.enablePages(
        TEST_TOKEN,
        TEST_OWNER,
        TEST_REPO,
        customBranch,
      );

      expect(mockPagesService.enablePages).toHaveBeenCalledWith(
        TEST_TOKEN,
        TEST_OWNER,
        TEST_REPO,
        customBranch,
      );
    });
  });

  describe("getPagesStatus", (): void => {
    it("should delegate to pagesService.getPagesStatus", async (): Promise<void> => {
      const expected: PagesInfo = {
        enabled: true,
        url: "https://test-user.github.io/test-repo",
        status: "built",
      };
      mockPagesService.getPagesStatus.mockResolvedValue(expected);

      const result: PagesInfo = await adapter.getPagesStatus(
        TEST_TOKEN,
        TEST_OWNER,
        TEST_REPO,
      );

      expect(mockLogger.debug).toHaveBeenCalledWith(
        "GithubApiAdapter.getPagesStatus",
      );
      expect(mockPagesService.getPagesStatus).toHaveBeenCalledWith(
        TEST_TOKEN,
        TEST_OWNER,
        TEST_REPO,
      );
      expect(result).toEqual(expected);
    });
  });
});
