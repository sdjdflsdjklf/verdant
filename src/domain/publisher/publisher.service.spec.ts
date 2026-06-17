import type {
  VaultRepositoryPort,
  KeyValueStorePort,
  LoggerPort,
  GitHubApiPort,
} from "../ports";
import type {
  PublishFile,
  PublishResult,
  SiteConfig,
  GeneratedSite,
} from "../../types/publisher.types";
import type { PublishCache } from "../../types/cache.types";
import type { GitPushResult, RepoInfo } from "../../types/github.types";
import { SiteGeneratorService } from "./site-generator.service";
import { DiffEngineService } from "./diff-engine.service";
import { PublisherService } from "./publisher.service";
import type { ThemeRenderer } from "../../domain/theme/theme.renderer";
import type { LinkGraphService } from "./link-graph.service";

describe("PublisherService", (): void => {
  let mockVaultRepo: jest.Mocked<VaultRepositoryPort>;
  let mockStore: jest.Mocked<KeyValueStorePort>;
  let mockLogger: jest.Mocked<LoggerPort>;
  let mockGitHubApi: jest.Mocked<GitHubApiPort>;
  let mockRenderer: { render: jest.Mock };
  let mockThemeRenderer: jest.Mocked<ThemeRenderer>;
  let mockLinkGraphService: jest.Mocked<LinkGraphService>;
  let siteGenerator: SiteGeneratorService;
  let diffEngine: DiffEngineService;
  let service: PublisherService;
  let defaultConfig: SiteConfig;
  let progressCallback: jest.Mock;

  const samplePublishFile: PublishFile = {
    relativePath: "notes/test.md",
    absolutePath: "/vault/notes/test.md",
    content: `---
title: Test Note
tags: [dev]
---
# Content`,
    hash: "abc",
    mtime: 1716000000000,
  };

  beforeEach((): void => {
    mockRenderer = {
      render: jest.fn().mockResolvedValue("<p>Rendered</p>"),
    };

    mockVaultRepo = {
      readFile: jest.fn(),
      readBinary: jest.fn(),
      exists: jest.fn(),
      listMarkdownFiles: jest.fn(),
      getPublishFile: jest.fn().mockResolvedValue(samplePublishFile),
    };

    mockStore = {
      get: jest.fn().mockReturnValue(undefined),
      set: jest.fn(),
      delete: jest.fn().mockReturnValue(true),
      has: jest.fn().mockReturnValue(false),
      clear: jest.fn(),
      getAll: jest.fn().mockReturnValue({}),
    };

    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      setLevel: jest.fn(),
    };

    mockGitHubApi = {
      validateToken: jest.fn(),
      ensureRepoExists: jest.fn().mockResolvedValue({
        name: "my-garden",
        owner: "testuser",
        fullName: "testuser/my-garden",
        url: "https://github.com/testuser/my-garden",
        defaultBranch: "main",
        exists: true,
      } satisfies RepoInfo),
      pushFiles: jest.fn().mockResolvedValue({ success: true, commitSha: "abc123" } satisfies GitPushResult),
      deleteFiles: jest.fn().mockResolvedValue({ success: true } satisfies GitPushResult),
      enablePages: jest.fn().mockResolvedValue(undefined),
      getPagesStatus: jest.fn(),
    };

    progressCallback = jest.fn();

    mockThemeRenderer = {
      getCSS: jest.fn().mockReturnValue("/* test CSS */"),
      renderIndex: jest.fn().mockReturnValue("<!DOCTYPE html><html><head><title>Index</title></head><body><h1>Index</h1></body></html>"),
      renderIndexPage: jest.fn().mockReturnValue("<!DOCTYPE html><html><head><title>Index</title></head><body><h1>Index</h1></body></html>"),
      getTotalPages: jest.fn().mockReturnValue(1),
      getFlexSearchBundle: jest.fn().mockReturnValue(""),
      renderNote: jest.fn().mockImplementation((html: string, title: string): string => {
        const escapedTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<!DOCTYPE html><html><head><title>${escapedTitle}</title></head><body><h1>${escapedTitle}</h1>${html}</body></html>`;
      }),
      renderTags: jest.fn().mockReturnValue("<!DOCTYPE html><html><head><title>Tags</title></head><body><h1>Tags</h1></body></html>"),
      renderTagDetail: jest.fn().mockReturnValue("<!DOCTYPE html><html><head><title>Tag Detail</title></head><body><h1>Tag Detail</h1></body></html>"),
      renderFeed: jest.fn().mockReturnValue('<?xml version="1.0"?><feed><title>Feed</title></feed>'),
      buildTocHtml: jest.fn().mockReturnValue(""),
      buildRelatedNotesHtml: jest.fn().mockReturnValue(""),
      buildCommentsHtml: jest.fn().mockReturnValue(""),
    } as unknown as jest.Mocked<ThemeRenderer>;

    mockLinkGraphService = {
      buildGraph: jest.fn().mockReturnValue({
        edges: new Map(),
        slugToTitle: new Map(),
        backlinks: new Map(),
      }),
      getRelatedNotes: jest.fn().mockReturnValue([]),
      getPrevNext: jest.fn().mockReturnValue({}),
    } as unknown as jest.Mocked<LinkGraphService>;

    siteGenerator = new SiteGeneratorService(mockRenderer, mockLogger, mockThemeRenderer, mockLinkGraphService, mockVaultRepo);
    diffEngine = new DiffEngineService(mockLogger, mockStore);
    service = new PublisherService(
      mockVaultRepo,
      mockStore,
      mockLogger,
      mockGitHubApi,
      siteGenerator,
      diffEngine,
      mockThemeRenderer,
    );

    defaultConfig = {
      title: "My Verdant",
      description: "A digital garden",
      baseUrl: "https://user.github.io/garden",
      themeId: "default",
      githubToken: "ghp_test_token",
      githubOwner: "testuser",
      githubRepo: "my-garden",
    };
  });

  describe("publish", (): void => {
    it("should execute full publish flow successfully", async (): Promise<void> => {
      const result: PublishResult = await service.publish(
        ["notes/test.md"],
        defaultConfig,
        progressCallback,
      );

      expect(result.success).toBe(true);
      expect(result.notesPublished).toBe(1);
      expect(result.wasIncremental).toBe(false);
      expect(result.siteUrl).toBe("https://user.github.io/garden");
      expect(mockVaultRepo.getPublishFile).toHaveBeenCalledWith("notes/test.md");
      expect(mockGitHubApi.pushFiles).toHaveBeenCalledWith(
        "ghp_test_token",
        "testuser",
        "my-garden",
        "gh-pages",
        expect.any(Array),
        expect.any(String),
      );
      expect(mockStore.set).toHaveBeenCalled();
    });

    it("should call progress callback with each step", async (): Promise<void> => {
      await service.publish(["notes/test.md"], defaultConfig, progressCallback);

      expect(progressCallback).toHaveBeenCalledWith(
        expect.objectContaining({ step: "scanning" }),
      );
      expect(progressCallback).toHaveBeenCalledWith(
        expect.objectContaining({ step: "generating" }),
      );
      expect(progressCallback).toHaveBeenCalledWith(
        expect.objectContaining({ step: "pushing" }),
      );
      expect(progressCallback).toHaveBeenCalledWith(
        expect.objectContaining({ step: "done" }),
      );
    });

    it("should enforce free-tier limit", async (): Promise<void> => {
      const manyNotes: string[] = Array.from(
        { length: 11 },
        (_, i: number): string => `notes/note-${i}.md`,
      );

      const result: PublishResult = await service.publish(
        manyNotes,
        defaultConfig,
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("Free tier limit exceeded");
      expect(mockGitHubApi.pushFiles).not.toHaveBeenCalled();
    });

    it("should reject empty notes list", async (): Promise<void> => {
      const result: PublishResult = await service.publish(
        [],
        defaultConfig,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle GitHub push failure", async (): Promise<void> => {
      mockGitHubApi.pushFiles.mockResolvedValue({
        success: false,
        error: "Push rejected",
      } satisfies GitPushResult);

      const result: PublishResult = await service.publish(
        ["notes/test.md"],
        defaultConfig,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle vault repo errors gracefully", async (): Promise<void> => {
      mockVaultRepo.getPublishFile.mockRejectedValue(
        new Error("File not found"),
      );

      const result: PublishResult = await service.publish(
        ["notes/missing.md"],
        defaultConfig,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should report error step in progress on failure", async (): Promise<void> => {
      mockVaultRepo.getPublishFile.mockRejectedValue(new Error("Error"));

      await service.publish(["notes/test.md"], defaultConfig, progressCallback);

      expect(progressCallback).toHaveBeenCalledWith(
        expect.objectContaining({ step: "error" }),
      );
    });

    it("should measure elapsed time", async (): Promise<void> => {
      const result: PublishResult = await service.publish(
        ["notes/test.md"],
        defaultConfig,
      );

      expect(result.elapsedMs).toBeGreaterThanOrEqual(0);
    });

    it("should update cache with file entries after publish", async (): Promise<void> => {
      await service.publish(["notes/test.md"], defaultConfig);

      expect(mockStore.set).toHaveBeenCalledWith(
        "main",
        expect.objectContaining({
          version: 1,
          files: expect.objectContaining({
            "notes/test.md": expect.objectContaining({
              hash: expect.any(String),
              size: expect.any(Number),
            }),
          }),
        }),
      );
    });
  });

  describe("publishIncremental", (): void => {
    beforeEach((): void => {
      mockStore.get.mockReturnValue({
        version: 1,
        lastPublished: "2026-01-15T10:00:00Z",
        files: {
          "notes/test.md": {
            hash: "abc",
            size: 100,
            lastModified: 1716000000001,
          },
        },
        siteConfig: {
          repo: "my-garden",
          branch: "gh-pages",
        },
      } satisfies PublishCache);
    });

    it("should execute incremental publish with no changes", async (): Promise<void> => {
      // The mock vault repo returns the same file content each time
      // The diff engine should detect no changes if the hash matches
      const { sha256 } = await import("../../shared/utils/crypto.utils");
      const contentHash: string = await sha256(samplePublishFile.content);

      mockGitHubApi.pushFiles.mockResolvedValue({ success: true, commitSha: "abc123" } satisfies GitPushResult);

      // Set cache hash to match current file content
      mockStore.get.mockReturnValue({
        version: 1,
        lastPublished: "2026-01-15T10:00:00Z",
        files: {
          "notes/test.md": {
            hash: contentHash,
            size: 100,
            lastModified: 1716000000000,
          },
        },
        siteConfig: {
          repo: "my-garden",
          branch: "gh-pages",
        },
      } satisfies PublishCache);

      const result: PublishResult = await service.publishIncremental(
        ["notes/test.md"],
        defaultConfig,
      );

      expect(result.success).toBe(true);
      expect(result.notesPublished).toBe(0);
      expect(result.wasIncremental).toBe(true);
      expect(mockGitHubApi.pushFiles).not.toHaveBeenCalled();
    });

    it("should treat all files as added when no cache exists", async (): Promise<void> => {
      mockStore.get.mockReturnValue(null);

      const result: PublishResult = await service.publishIncremental(
        ["notes/test.md"],
        defaultConfig,
      );

      expect(result.success).toBe(true);
      expect(result.wasIncremental).toBe(true);
      expect(mockGitHubApi.pushFiles).toHaveBeenCalled();
    });

    it("should push changed files when diff detects modifications", async (): Promise<void> => {
      mockGitHubApi.pushFiles.mockResolvedValue({ success: true, commitSha: "abc123" } satisfies GitPushResult);

      const result: PublishResult = await service.publishIncremental(
        ["notes/test.md"],
        defaultConfig,
      );

      expect(result.success).toBe(true);
      expect(result.wasIncremental).toBe(true);
      expect(mockGitHubApi.pushFiles).toHaveBeenCalled();
    });

    it("should call deleteFiles for removed notes", async (): Promise<void> => {
      mockGitHubApi.pushFiles.mockResolvedValue({ success: true, commitSha: "abc123" } satisfies GitPushResult);
      mockGitHubApi.deleteFiles.mockResolvedValue({ success: true } satisfies GitPushResult);

      // Set up cache with a file that won't be in the current publish list
      mockStore.get.mockReturnValue({
        version: 1,
        lastPublished: "2026-01-15T10:00:00Z",
        files: {
          "notes/test.md": { hash: "oldhash", size: 100, lastModified: 1716000000000 },
          "notes/removed.md": { hash: "oldhash2", size: 50, lastModified: 1716000000000 },
        },
        siteConfig: { repo: "my-garden", branch: "gh-pages" },
      } satisfies PublishCache);

      await service.publishIncremental(
        ["notes/test.md"],
        defaultConfig,
      );

      expect(mockGitHubApi.deleteFiles).toHaveBeenCalledWith(
        "ghp_test_token",
        "testuser",
        "my-garden",
        "gh-pages",
        ["notes/removed/index.html"],
        expect.any(String),
      );
    });

    it("should handle push failure in incremental publish", async (): Promise<void> => {
      mockGitHubApi.pushFiles.mockResolvedValue({
        success: false,
        error: "Network error",
      } satisfies GitPushResult);

      const result: PublishResult = await service.publishIncremental(
        ["notes/test.md"],
        defaultConfig,
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("Network error");
    });

    it("should report progress during incremental publish", async (): Promise<void> => {
      await service.publishIncremental(
        ["notes/test.md"],
        defaultConfig,
        progressCallback,
      );

      expect(progressCallback).toHaveBeenCalledWith(
        expect.objectContaining({ step: "scanning" }),
      );
      expect(progressCallback).toHaveBeenCalledWith(
        expect.objectContaining({ step: "generating" }),
      );
    });

    it("should handle errors in incremental publish", async (): Promise<void> => {
      mockVaultRepo.getPublishFile.mockRejectedValue(
        new Error("Vault read error"),
      );

      const result: PublishResult = await service.publishIncremental(
        ["notes/test.md"],
        defaultConfig,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should enforce free-tier limit in incremental publish", async (): Promise<void> => {
      const manyNotes: string[] = Array.from(
        { length: 11 },
        (_, i: number): string => `notes/note-${i}.md`,
      );

      const result: PublishResult = await service.publishIncremental(
        manyNotes,
        defaultConfig,
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain("Free tier limit exceeded");
    });
  });

  describe("publish — missing branch coverage", (): void => {
    it("should use default error message when git push fails without error details", async (): Promise<void> => {
      mockGitHubApi.pushFiles.mockResolvedValue({
        success: false,
      } satisfies GitPushResult);

      const result: PublishResult = await service.publish(
        ["notes/test.md"],
        defaultConfig,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Git push failed");
    });

    it("should handle non-Error thrown values in publish catch block", async (): Promise<void> => {
      mockVaultRepo.getPublishFile.mockRejectedValue("Raw string error");

      const result: PublishResult = await service.publish(
        ["notes/test.md"],
        defaultConfig,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Unknown error");
    });

    it("should handle undefined tag entries in buildTagsHtml", async (): Promise<void> => {
      mockGitHubApi.pushFiles.mockResolvedValue({
        success: true,
        commitSha: "abc123",
      } satisfies GitPushResult);

      const tagsWithMissing: Record<string, { title: string; path: string }[]> = {};
      Object.defineProperty(tagsWithMissing, "mytag", {
        value: undefined,
        enumerable: true,
      });

      jest.spyOn(siteGenerator, "generateSite").mockResolvedValueOnce({
        files: [],
        navigation: [],
        tags: tagsWithMissing,
        searchIndex: [],
        indexHtml: "",
      } as unknown as GeneratedSite);

      const result: PublishResult = await service.publish(
        ["notes/test.md"],
        defaultConfig,
      );

      expect(result.success).toBe(true);
    });
  });

  describe("publishIncremental — missing branch coverage", (): void => {
    beforeEach((): void => {
      mockStore.get.mockReturnValue({
        version: 1,
        lastPublished: "2026-01-15T10:00:00Z",
        files: {
          "notes/test.md": {
            hash: "abc",
            size: 100,
            lastModified: 1716000000001,
          },
        },
        siteConfig: {
          repo: "my-garden",
          branch: "gh-pages",
        },
      } satisfies PublishCache);
    });

    it("should use default error message when incremental push fails without error details", async (): Promise<void> => {
      mockGitHubApi.pushFiles.mockResolvedValue({
        success: false,
      } satisfies GitPushResult);

      const result: PublishResult = await service.publishIncremental(
        ["notes/test.md"],
        defaultConfig,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Git push failed");
    });

    it("should handle non-Error thrown values in incremental publish catch block", async (): Promise<void> => {
      mockVaultRepo.getPublishFile.mockRejectedValue("Raw string error");

      const result: PublishResult = await service.publishIncremental(
        ["notes/test.md"],
        defaultConfig,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Unknown error");
    });
  });
});
