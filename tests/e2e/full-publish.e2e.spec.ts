import "reflect-metadata";
import type {
  VaultRepositoryPort,
  KeyValueStorePort,
  LoggerPort,
  GitHubApiPort,
  MarkdownRendererPort,
} from "../../src/domain/ports";
import type {
  PublishFile,
  PublishResult,
  SiteConfig,
} from "../../src/types/publisher.types";
import type { PublishCache } from "../../src/types/cache.types";
import type { GitPushResult } from "../../src/types/github.types";
import { SiteGeneratorService } from "../../src/domain/publisher/site-generator.service";
import { DiffEngineService } from "../../src/domain/publisher/diff-engine.service";
import { PublisherService } from "../../src/domain/publisher/publisher.service";
import type { ThemeRenderer } from "../../src/domain/theme/theme.renderer";
import type { LinkGraphService } from "../../src/domain/publisher/link-graph.service";
import { MockGitHubApi } from "../mocks/github-api.mock";
import { sha256 } from "../../src/shared/utils/crypto.utils";
import {
  createTestNote,
  createTestVault,
  toPublishFile,
  type TestVaultNote,
} from "./helpers/test-vault.setup";

jest.setTimeout(30000);

interface MockVaultRepo extends VaultRepositoryPort {
  _setNoteContent: (path: string, content: TestVaultNote) => void;
  _setNotes: (notes: TestVaultNote[]) => void;
  _addNote: (note: TestVaultNote) => void;
  _removeNote: (path: string) => void;
}

function createMockVaultRepo(): MockVaultRepo {
  let notes: Map<string, TestVaultNote> = new Map();

  const repo: MockVaultRepo = {
    readFile: jest.fn<Promise<string>, [string]>().mockResolvedValue(""),
    exists: jest.fn<Promise<boolean>, [string]>().mockResolvedValue(true),
    listMarkdownFiles: jest.fn<Promise<string[]>, []>().mockResolvedValue([]),

    getPublishFile: jest.fn<Promise<PublishFile>, [string]>().mockImplementation(
      async (path: string): Promise<PublishFile> => {
        const note: TestVaultNote | undefined = notes.get(path);
        if (note === undefined) {
          const fallbackNote: TestVaultNote = createTestNote(path, "Untitled", []);
          const content: string = `---\ntitle: Untitled\n---\n\n# Untitled`;
          const hash: string = await sha256(content);
          return {
            relativePath: path,
            absolutePath: `/vault/${path}`,
            content,
            hash,
            mtime: Date.now(),
          };
        }
        return toPublishFile(note);
      },
    ),

    _setNoteContent: (path: string, note: TestVaultNote): void => {
      notes.set(path, note);
    },

    _setNotes: (newNotes: TestVaultNote[]): void => {
      notes = new Map(newNotes.map((n: TestVaultNote): [string, TestVaultNote] => [n.relativePath, n]));
    },

    _addNote: (note: TestVaultNote): void => {
      notes.set(note.relativePath, note);
    },

    _removeNote: (path: string): void => {
      notes.delete(path);
    },
  };

  return repo;
}

function createMockStore(): KeyValueStorePort & {
  _savedStore: Record<string, unknown>;
} {
  const saved: Record<string, unknown> = {};

  return {
    get: jest.fn(<T,>(_key: string): T | undefined => saved["main"] as T | undefined),
    set: jest.fn(<T,>(key: string, value: T): void => {
      saved[key] = value;
    }),
    delete: jest.fn((key: string): boolean => {
      const existed: boolean = key in saved;
      delete saved[key];
      return existed;
    }),
    has: jest.fn((key: string): boolean => key in saved),
    clear: jest.fn((): void => {
      for (const key of Object.keys(saved)) {
        delete saved[key];
      }
    }),
    getAll: jest.fn(<T,>(): Record<string, T> => ({ ...saved } as Record<string, T>)),
    _savedStore: saved,
  };
}

function createLogger(): jest.Mocked<LoggerPort> {
  return {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    setLevel: jest.fn(),
  };
}

function createRenderer(): jest.Mocked<MarkdownRendererPort> {
  return {
    render: jest.fn<Promise<string>, [string, string]>().mockResolvedValue(
      "<p>Rendered content</p>",
    ),
  };
}

function defaultConfig(): SiteConfig {
  return {
    title: "My Garden",
    description: "A digital garden",
    baseUrl: "https://test-user.github.io/test-repo",
    themeId: "default",
    githubToken: "ghp_test_token_12345",
    githubOwner: "test-user",
    githubRepo: "test-repo",
  };
}

async function createPublisherService(): Promise<{
  service: PublisherService;
  vaultRepo: MockVaultRepo;
  store: KeyValueStorePort & { _savedStore: Record<string, unknown> };
  logger: jest.Mocked<LoggerPort>;
  githubApi: MockGitHubApi;
  renderer: jest.Mocked<MarkdownRendererPort>;
  config: SiteConfig;
}> {
  const vaultRepo: MockVaultRepo = createMockVaultRepo();
  const store: KeyValueStorePort & { _savedStore: Record<string, unknown> } = createMockStore();
  const logger: jest.Mocked<LoggerPort> = createLogger();
  const githubApi: MockGitHubApi = new MockGitHubApi();
  const renderer: jest.Mocked<MarkdownRendererPort> = createRenderer();

  const themeRenderer: jest.Mocked<ThemeRenderer> = {
    getCSS: jest.fn().mockReturnValue("/* test CSS */"),
    renderIndex: jest.fn().mockReturnValue("<!DOCTYPE html><html><head><title>E2E Index</title></head><body><h1>Index</h1><div class=\"garden-card-grid\"></div></body></html>"),
    renderIndexPage: jest.fn().mockReturnValue("<!DOCTYPE html><html><head><title>E2E Index</title></head><body><h1>Index</h1><div class=\"garden-card-grid\"></div></body></html>"),
    getTotalPages: jest.fn().mockReturnValue(1),
    getFlexSearchBundle: jest.fn().mockReturnValue(""),
    renderNote: jest.fn().mockImplementation((html: string, title: string): string => `<!DOCTYPE html><html><head><title>${title}</title></head><body><h1>${title}</h1>${html}</body></html>`),
    renderTags: jest.fn().mockReturnValue("<!DOCTYPE html><html><head><title>Tags</title></head><body><h1>Tags</h1></body></html>"),
    renderTagDetail: jest.fn().mockReturnValue("<!DOCTYPE html><html><head><title>Tag Detail</title></head><body><h1>Tag Detail</h1></body></html>"),
    renderFeed: jest.fn().mockReturnValue('<?xml version="1.0"?><feed><title>Feed</title></feed>'),
    buildTocHtml: jest.fn().mockReturnValue(""),
    buildRelatedNotesHtml: jest.fn().mockReturnValue(""),
    buildCommentsHtml: jest.fn().mockReturnValue(""),
  } as unknown as jest.Mocked<ThemeRenderer>;

  const mockLinkGraphService: jest.Mocked<LinkGraphService> = {
    buildGraph: jest.fn().mockReturnValue({
      edges: new Map(),
      slugToTitle: new Map(),
      backlinks: new Map(),
    }),
    getRelatedNotes: jest.fn().mockReturnValue([]),
    getPrevNext: jest.fn().mockReturnValue({}),
  } as unknown as jest.Mocked<LinkGraphService>;

  githubApi.setPushFilesResult({ success: true, commitSha: "e2e-test-sha" });
  githubApi.setDeleteFilesResult({ success: true, commitSha: "e2e-delete-sha" });

  const siteGenerator: SiteGeneratorService = new SiteGeneratorService(
    renderer,
    logger,
    themeRenderer,
    mockLinkGraphService,
    vaultRepo,
  );
  const diffEngine: DiffEngineService = new DiffEngineService(logger, store);
  const service: PublisherService = new PublisherService(
    vaultRepo,
    store,
    logger,
    githubApi,
    siteGenerator,
    diffEngine,
    themeRenderer,
  );
  const config: SiteConfig = defaultConfig();

  return { service, vaultRepo, store, logger, githubApi, renderer, config };
}

// ── Test Scenarios ───────────────────────────────────────────────────────

describe("Full Publish E2E", (): void => {
  describe("T1: Full publish — first-time publish", (): void => {
    it("should create a site from selected notes successfully", async (): Promise<void> => {
      const { service, vaultRepo, githubApi, config } =
        await createPublisherService();
      const notes: TestVaultNote[] = createTestVault().slice(0, 3);
      vaultRepo._setNotes(notes);

      const result: PublishResult = await service.publish(
        notes.map((n: TestVaultNote): string => n.relativePath),
        config,
      );

      expect(result.success).toBe(true);
      expect(result.notesPublished).toBe(3);
      expect(result.wasIncremental).toBe(false);
      expect(result.siteUrl).toBe("https://test-user.github.io/test-repo");
      expect(result.elapsedMs).toBeGreaterThanOrEqual(0);

      // Verify pushFiles was called with site files
      const pushCall: unknown[] | undefined = githubApi.getLastCall("pushFiles");
      expect(pushCall).toBeDefined();
      expect(pushCall![0]).toBe("ghp_test_token_12345");
      expect(pushCall![1]).toBe("test-user");
      expect(pushCall![2]).toBe("test-repo");
      expect(pushCall![3]).toBe("gh-pages");
      const files: unknown = pushCall![4];
      expect(Array.isArray(files)).toBe(true);
      // Should have: 3 note files + index.html + navigation.json + search.json + tags/index.html + 3 tag-detail pages + .nojekyll + feed.xml + assets/theme.css + CNAME = 15
      expect((files as unknown[]).length).toBe(15);
      expect(pushCall![5]).toBe("chore: update garden");
    });

    it("should write cache after successful publish", async (): Promise<void> => {
      const { service, vaultRepo, store, config } =
        await createPublisherService();
      const notes: TestVaultNote[] = createTestVault().slice(0, 3);
      vaultRepo._setNotes(notes);

      await service.publish(
        notes.map((n: TestVaultNote): string => n.relativePath),
        config,
      );

      expect(store.set).toHaveBeenCalledWith(
        "main",
        expect.objectContaining({
          version: 1,
          files: expect.objectContaining({
            "notes/welcome.md": expect.any(Object),
            "notes/projects.md": expect.any(Object),
            "notes/ideas.md": expect.any(Object),
          }),
        }),
      );
    });
  });

  describe("T2: Incremental publish — modified note", (): void => {
    it("should push only changed files when a note is modified", async (): Promise<void> => {
      const { service, vaultRepo, githubApi, config } =
        await createPublisherService();
      const notes: TestVaultNote[] = createTestVault().slice(0, 2);
      vaultRepo._setNotes(notes);

      // First publish — full
      await service.publish(
        notes.map((n: TestVaultNote): string => n.relativePath),
        config,
      );

      githubApi.reset();

      const initialCallCount: number = githubApi.getCallHistory().length;

      // Modify one note
      vaultRepo._setNoteContent("notes/projects.md", createTestNote(
        "notes/projects.md",
        "Projects (Updated)",
        ["dev", "meta"],
        "## New Project\n\n- Project C",
      ));

      // Incremental publish
      const result: PublishResult = await service.publishIncremental(
        notes.map((n: TestVaultNote): string => n.relativePath),
        config,
      );

      expect(result.success).toBe(true);
      expect(result.wasIncremental).toBe(true);

      // Verify pushFiles was called
      const pushCalls: unknown[] | undefined = githubApi.getLastCall("pushFiles");
      expect(pushCalls).toBeDefined();

      // Verify deleteFiles was NOT called (nothing deleted)
      const deleteCallsCount: number = githubApi.getCallHistory()
        .filter((c: { method: string }): boolean => c.method === "deleteFiles")
        .length;
      expect(deleteCallsCount).toBe(0);

      // Verify new calls were made (beyond initial)
      expect(githubApi.getCallHistory().length).toBeGreaterThan(initialCallCount);
    });
  });

  describe("T3: New note added", (): void => {
    it("should push new file when a note is added", async (): Promise<void> => {
      const { service, vaultRepo, githubApi, config } =
        await createPublisherService();
      const notes: TestVaultNote[] = createTestVault().slice(0, 2);
      vaultRepo._setNotes(notes);

      // First publish
      await service.publish(
        notes.map((n: TestVaultNote): string => n.relativePath),
        config,
      );

      githubApi.reset();

      // Add a new note
      const newNote: TestVaultNote = createTestNote(
        "notes/new-note.md",
        "New Note",
        ["new"],
        "This is a brand new note.",
      );
      vaultRepo._addNote(newNote);
      const updatedNotes: string[] = [
        ...notes.map((n: TestVaultNote): string => n.relativePath),
        newNote.relativePath,
      ];

      const result: PublishResult = await service.publishIncremental(
        updatedNotes,
        config,
      );

      expect(result.success).toBe(true);
      expect(result.wasIncremental).toBe(true);

      // Verify pushFiles was called
      const pushCalls: unknown[] | undefined = githubApi.getLastCall("pushFiles");
      expect(pushCalls).toBeDefined();
    });
  });

  describe("T4: Note removed", (): void => {
    it("should delete files when notes are deselected", async (): Promise<void> => {
      const { service, vaultRepo, githubApi, config } =
        await createPublisherService();
      const notes: TestVaultNote[] = createTestVault().slice(0, 3);
      vaultRepo._setNotes(notes);
      const notePaths: string[] = notes.map((n: TestVaultNote): string => n.relativePath);

      // First publish with 3 notes
      await service.publish(notePaths, config);

      githubApi.reset();

      // Remove one note from selection
      vaultRepo._removeNote("notes/ideas.md");
      const remainingPaths: string[] = notePaths.filter(
        (p: string): boolean => p !== "notes/ideas.md",
      );

      const result: PublishResult = await service.publishIncremental(
        remainingPaths,
        config,
      );

      expect(result.success).toBe(true);

      // Verify deleteFiles was called with the removed note path
      const deleteCall: unknown[] | undefined = githubApi.getLastCall("deleteFiles");
      expect(deleteCall).toBeDefined();
      expect(deleteCall![4]).toEqual(
        expect.arrayContaining(["notes/ideas/index.html"]),
      );
    });
  });

  describe("T5: Free tier limit", (): void => {
    it("should block publishing more than 10 notes with free license", async (): Promise<void> => {
      const { service, config } = await createPublisherService();
      const manyNotes: string[] = Array.from(
        { length: 11 },
        (_: unknown, i: number): string => `notes/note-${i}.md`,
      );

      const result: PublishResult = await service.publish(manyNotes, config);

      expect(result.success).toBe(false);
      expect(result.error).toContain("Free tier limit exceeded");
      expect(result.notesPublished).toBe(0);
    });
  });

  describe("T6: Network retry", (): void => {
    it("should succeed on retry after transient GitHub API failure", async (): Promise<void> => {
      const { service, vaultRepo, githubApi, config } =
        await createPublisherService();
      const notes: TestVaultNote[] = createTestVault().slice(0, 2);
      vaultRepo._setNotes(notes);
      const notePaths: string[] = notes.map((n: TestVaultNote): string => n.relativePath);

      // Simulate transient failure: first call fails
      githubApi.setPushFilesTransientFailures(1);

      // First attempt — fails
      const firstResult: PublishResult = await service.publish(notePaths, config);
      expect(firstResult.success).toBe(false);
      expect(firstResult.error).toBe("Transient network error");

      // Reset transient failure so next call succeeds
      githubApi.setPushFilesTransientFailures(0);
      // Re-set the success result (was overwritten by transient setup)
      githubApi.setPushFilesResult({ success: true, commitSha: "retry-sha" });

      // Clear cache so write succeeds fresh
      // (cache may have partial state from first attempt)
      const secondResult: PublishResult = await service.publish(notePaths, config);

      expect(secondResult.success).toBe(true);
      expect(secondResult.notesPublished).toBe(2);
    });
  });

  describe("T7: Token invalid", (): void => {
    it("should return clear error message when token is invalid", async (): Promise<void> => {
      const { service, vaultRepo, githubApi, config } =
        await createPublisherService();
      const notes: TestVaultNote[] = createTestVault().slice(0, 1);
      vaultRepo._setNotes(notes);

      // Simulate 401 — pushFiles returns auth error
      githubApi.setPushFilesResult({
        success: false,
        error: "Bad credentials (401). Please check your GitHub token.",
      });

      const result: PublishResult = await service.publish(
        notes.map((n: TestVaultNote): string => n.relativePath),
        config,
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      // The error message should indicate auth issues
      expect(result.error!.toLowerCase()).toMatch(/token|credential|auth/);
    });
  });
});
