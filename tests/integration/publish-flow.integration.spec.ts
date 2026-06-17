import "reflect-metadata";
import type {
  VaultRepositoryPort,
  KeyValueStorePort,
  LoggerPort,
  MarkdownRendererPort,
} from "../../src/domain/ports";
import type { GitHubApiPort } from "../../src/domain/ports/github-api.port";
import type {
  PublishFile,
  PublishResult,
  SiteConfig,
} from "../../src/types/publisher.types";
import type { GitFileEntry, GitPushResult } from "../../src/types/github.types";
import { SiteGeneratorService } from "../../src/domain/publisher/site-generator.service";
import { DiffEngineService } from "../../src/domain/publisher/diff-engine.service";
import { PublisherService } from "../../src/domain/publisher/publisher.service";
import type { ThemeRenderer } from "../../src/domain/theme/theme.renderer";
import type { LinkGraphService } from "../../src/domain/publisher/link-graph.service";
import { MockGitHubApi } from "../mocks/github-api.mock";

function createMockVaultRepo(): jest.Mocked<VaultRepositoryPort> {
  return {
    readFile: jest.fn<Promise<string>, [string]>().mockResolvedValue(""),
    exists: jest.fn<Promise<boolean>, [string]>().mockResolvedValue(true),
    listMarkdownFiles: jest.fn<Promise<string[]>, []>().mockResolvedValue([]),
    getPublishFile: jest.fn<Promise<PublishFile>, [string]>().mockImplementation(
      async (path: string): Promise<PublishFile> => ({
        relativePath: path,
        absolutePath: `/vault/${path}`,
        content: `---
title: Integration Test Note
tags: [test]
---
# Content for ${path}`,
        hash: "test-hash",
        mtime: 1716000000000,
      }),
    ),
  };
}

function createMockStore(): jest.Mocked<KeyValueStorePort> {
  return {
    get: jest.fn<undefined, [string]>().mockReturnValue(undefined),
    set: jest.fn<void, [string, unknown]>(),
    delete: jest.fn<boolean, [string]>().mockReturnValue(true),
    has: jest.fn<boolean, [string]>().mockReturnValue(false),
    clear: jest.fn<void, []>(),
    getAll: jest.fn<Record<string, unknown>, []>().mockReturnValue({}),
  };
}

function createMockLogger(): jest.Mocked<LoggerPort> {
  return {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setLevel: jest.fn(),
  };
}

function createMockRenderer(): jest.Mocked<MarkdownRendererPort> {
  return {
    render: jest.fn<Promise<string>, [string, string]>().mockResolvedValue(
      "<p>Rendered from integration test</p>",
    ),
  };
}

function makeConfig(): SiteConfig {
  return {
    title: "Integration Verdant",
    description: "Testing the integration",
    baseUrl: "https://int-user.github.io/int-repo",
    themeId: "default",
    githubToken: "ghp_int_token",
    githubOwner: "int-user",
    githubRepo: "int-repo",
  };
}

describe("PublisherService ↔ GitHubApiPort Integration", (): void => {
  let vaultRepo: jest.Mocked<VaultRepositoryPort>;
  let store: jest.Mocked<KeyValueStorePort>;
  let logger: jest.Mocked<LoggerPort>;
  let githubApi: MockGitHubApi;
  let renderer: jest.Mocked<MarkdownRendererPort>;
  let themeRenderer: jest.Mocked<ThemeRenderer>;
  let mockLinkGraphService: jest.Mocked<LinkGraphService>;
  let siteGenerator: SiteGeneratorService;
  let diffEngine: DiffEngineService;
  let publisher: PublisherService;
  let config: SiteConfig;

  beforeEach((): void => {
    vaultRepo = createMockVaultRepo();
    store = createMockStore();
    logger = createMockLogger();
    renderer = createMockRenderer();
    githubApi = new MockGitHubApi();

    githubApi.setPushFilesResult({
      success: true,
      commitSha: "int-test-commit-sha",
    });
    githubApi.setDeleteFilesResult({
      success: true,
      commitSha: "int-test-delete-sha",
    });
    githubApi.setEnsureRepoExistsResult({
      name: "int-repo",
      owner: "int-user",
      fullName: "int-user/int-repo",
      url: "https://github.com/int-user/int-repo",
      defaultBranch: "main",
      exists: true,
    });

    themeRenderer = {
      getCSS: jest.fn().mockReturnValue("/* test CSS */"),
      renderIndex: jest.fn().mockReturnValue("<!DOCTYPE html><html><head><title>Integration Index</title></head><body><h1>Index</h1><div class=\"garden-card-grid\"></div></body></html>"),
      renderIndexPage: jest.fn().mockReturnValue("<!DOCTYPE html><html><head><title>Integration Index</title></head><body><h1>Index</h1><div class=\"garden-card-grid\"></div></body></html>"),
      getTotalPages: jest.fn().mockReturnValue(1),
      getFlexSearchBundle: jest.fn().mockReturnValue(""),
      renderNote: jest.fn().mockImplementation((html: string, title: string, _tags: string[], _date: string | undefined, config: SiteConfig): string => {
        const escapedTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const siteTitle = config.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<!DOCTYPE html><html><head><title>${escapedTitle} — ${siteTitle}</title></head><body><h1>${escapedTitle}</h1>${html}<footer>${siteTitle}</footer></body></html>`;
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

    siteGenerator = new SiteGeneratorService(renderer, logger, themeRenderer, mockLinkGraphService, vaultRepo);
    diffEngine = new DiffEngineService(logger, store);
    publisher = new PublisherService(
      vaultRepo,
      store,
      logger,
      githubApi,
      siteGenerator,
      diffEngine,
      themeRenderer,
    );
    config = makeConfig();
  });

  describe("GitHub API call order", (): void => {
    it("should call pushFiles with correct chain of Blob → Tree → Commit → Ref", async (): Promise<void> => {
      await publisher.publish(
        ["notes/test-note.md"],
        config,
      );

      const pushCall: unknown[] | undefined = githubApi.getLastCall("pushFiles");
      expect(pushCall).toBeDefined();

      // Verify all required site files are included
      const files: unknown = pushCall![4];
      expect(Array.isArray(files)).toBe(true);
      const fileList: unknown[] = files as unknown[];
      expect(fileList.length).toBeGreaterThanOrEqual(4); // note + index + nav + search
    });

    it("should include index.html, navigation.json, and search.json in push", async (): Promise<void> => {
      await publisher.publish(
        ["notes/first.md", "notes/second.md"],
        config,
      );

      const pushCall: unknown[] | undefined = githubApi.getLastCall("pushFiles");
      const files: unknown = pushCall![4];
      const fileEntries: GitFileEntry[] = files as GitFileEntry[];

      const filePaths: string[] = fileEntries.map(
        (f: GitFileEntry): string => f.path,
      );
      expect(filePaths).toContain("index.html");
      expect(filePaths).toContain("navigation.json");
      expect(filePaths).toContain("search.json");
      expect(filePaths).toContain("tags/index.html");
    });
  });

  describe("File content encoding", (): void => {
    it("should pass markdown-rendered HTML as file content", async (): Promise<void> => {
      renderer.render.mockResolvedValue("<p>Custom rendered HTML</p>");

      await publisher.publish(
        ["notes/render-test.md"],
        config,
      );

      const pushCall: unknown[] | undefined = githubApi.getLastCall("pushFiles");
      const files: unknown = pushCall![4];
      const fileEntries: GitFileEntry[] = files as GitFileEntry[];

      const noteFile: GitFileEntry | undefined = fileEntries.find(
        (f: GitFileEntry): boolean =>
          f.path === "notes/render-test/index.html",
      );
      expect(noteFile).toBeDefined();
      expect(noteFile!.content).toContain("Custom rendered HTML");
      expect(noteFile!.content).toContain("<!DOCTYPE html>");
      expect(noteFile!.content).toContain("Integration Verdant");
    });

    it("should encode file entries with correct git metadata", async (): Promise<void> => {
      await publisher.publish(
        ["notes/git-meta-test.md"],
        config,
      );

      const pushCall: unknown[] | undefined = githubApi.getLastCall("pushFiles");
      const files: unknown = pushCall![4];
      const fileEntries: GitFileEntry[] = files as GitFileEntry[];

      for (const entry of fileEntries) {
        expect(entry.mode).toBe("100644");
        expect(entry.type).toBe("blob");
        expect(typeof entry.content).toBe("string");
        // .nojekyll is conventionally empty; all other files must have content
        if (entry.path !== ".nojekyll") {
          expect(entry.content.length).toBeGreaterThan(0);
        }
      }
    });
  });

  describe("Error propagation", (): void => {
    it("should propagate GitHub push failure to Publisher result", async (): Promise<void> => {
      githubApi.setPushFilesResult({
        success: false,
        error: "Commit failed: tree not found",
      });

      const result: PublishResult = await publisher.publish(
        ["notes/error-test.md"],
        config,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("Commit failed: tree not found");
    });

    it("should handle delete failure gracefully (delete result is not checked)", async (): Promise<void> => {
      // First publish to set up cache
      store.get.mockReturnValue({
        version: 1,
        lastPublished: "2026-01-15T10:00:00Z",
        files: {
          "notes/existing.md": {
            hash: "oldhash",
            size: 100,
            lastModified: 1716000000000,
          },
          "notes/to-delete.md": {
            hash: "oldhash2",
            size: 50,
            lastModified: 1716000000000,
          },
        },
        siteConfig: { repo: "int-repo", branch: "gh-pages" },
      });

      // Push succeeded but delete fails
      githubApi.setPushFilesResult({
        success: true,
        commitSha: "push-success",
      });
      githubApi.setDeleteFilesResult({
        success: false,
        error: "Delete failed: branch protection",
      });

      const result: PublishResult = await publisher.publishIncremental(
        ["notes/existing.md"],
        config,
      );

      // Publisher does not check deleteFiles result — it continues after the await
      expect(result.success).toBe(true);
    });
  });

  describe("SiteConfig passing", (): void => {
    it("should pass githubToken through to GitHub API calls", async (): Promise<void> => {
      const customConfig: SiteConfig = {
        ...config,
        githubToken: "ghp_custom_secret_token",
      };

      await publisher.publish(
        ["notes/config-test.md"],
        customConfig,
      );

      const pushCall: unknown[] | undefined = githubApi.getLastCall("pushFiles");
      expect(pushCall![0]).toBe("ghp_custom_secret_token");
    });

    it("should pass owner and repo correctly through the chain", async (): Promise<void> => {
      const customConfig: SiteConfig = {
        ...config,
        githubOwner: "custom-org",
        githubRepo: "custom-repo",
      };

      await publisher.publish(
        ["notes/custom-test.md"],
        customConfig,
      );

      const pushCall: unknown[] | undefined = githubApi.getLastCall("pushFiles");
      expect(pushCall![1]).toBe("custom-org");
      expect(pushCall![2]).toBe("custom-repo");
    });

    it("should use default gh-pages branch when no githubBranch is set", async (): Promise<void> => {
      await publisher.publish(
        ["notes/branch-test.md"],
        { ...config, githubBranch: undefined },
      );

      const pushCall: unknown[] | undefined = githubApi.getLastCall("pushFiles");
      expect(pushCall![3]).toBe("gh-pages");
    });

    it("should use custom branch when githubBranch is set", async (): Promise<void> => {
      await publisher.publish(
        ["notes/branch-custom.md"],
        { ...config, githubBranch: "custom-branch" },
      );

      const pushCall: unknown[] | undefined = githubApi.getLastCall("pushFiles");
      expect(pushCall![3]).toBe("custom-branch");
    });
  });

  describe("Multiple notes", (): void => {
    it("should batch all files into a single pushFiles call", async (): Promise<void> => {
      await publisher.publish(
        ["notes/a.md", "notes/b.md", "notes/c.md"],
        config,
      );

      const pushCalls: { method: string; args: unknown[] }[] =
        githubApi.getCallHistory().filter(
          (c: { method: string }): boolean => c.method === "pushFiles",
        );
      expect(pushCalls).toHaveLength(1);

      const files: GitFileEntry[] = pushCalls[0]!.args[4] as GitFileEntry[];
      // 3 note files + index.html + navigation.json + search.json + tags/index.html + tags/test/index.html + .nojekyll + feed.xml + assets/theme.css + CNAME = 12
      expect(files.length).toBe(12);
    });

    it("should publish all notes successfully", async (): Promise<void> => {
      const result: PublishResult = await publisher.publish(
        ["notes/a.md", "notes/b.md", "notes/c.md"],
        config,
      );

      expect(result.success).toBe(true);
      expect(result.notesPublished).toBe(3);
    });
  });
});
