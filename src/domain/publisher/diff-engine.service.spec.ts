import type { LoggerPort, KeyValueStorePort } from "../ports";
import type { PublishFile, FileDiff } from "../../types/publisher.types";
import type { PublishCache } from "../../types/cache.types";
import { DiffEngineService, filesMetadataMatch } from "./diff-engine.service";

describe("DiffEngineService", (): void => {
  let mockLogger: jest.Mocked<LoggerPort>;
  let mockStore: jest.Mocked<KeyValueStorePort>;
  let service: DiffEngineService;

  const makeFile = (path: string, content: string, mtime?: number): PublishFile => ({
    relativePath: path,
    absolutePath: `/vault/${path}`,
    content,
    hash: "",
    mtime: mtime ?? 1716000000000,
  });

  function makeCache(
    files: Record<string, { hash: string; size: number; lastModified: number }>,
  ): PublishCache {
    return {
      version: 1,
      lastPublished: "2026-01-15T10:00:00Z",
      files,
      siteConfig: {
        repo: "garden",
        branch: "gh-pages",
      },
    };
  }

  beforeEach((): void => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      setLevel: jest.fn(),
    };

    mockStore = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      has: jest.fn(),
      clear: jest.fn(),
      getAll: jest.fn(),
    };

    service = new DiffEngineService(mockLogger, mockStore);
  });

  describe("filesMetadataMatch", (): void => {
    it("should return true when mtime and size match", (): void => {
      const cached = { hash: "abc", size: 12, lastModified: 1716000000000 };
      const file = makeFile("test.md", "Hello World!", 1716000000000);
      expect(filesMetadataMatch(cached, file)).toBe(true);
    });

    it("should return false when mtime differs", (): void => {
      const cached = { hash: "abc", size: 12, lastModified: 1716000000000 };
      const file = makeFile("test.md", "Hello World!", 1716000001000);
      expect(filesMetadataMatch(cached, file)).toBe(false);
    });

    it("should return true when only size differs", (): void => {
      const cached = { hash: "abc", size: 100, lastModified: 1716000000000 };
      const file = makeFile("test.md", "Hello World!", 1716000000000);
      expect(filesMetadataMatch(cached, file)).toBe(true);
    });
  });

  describe("computeDiff", (): void => {
    it("should treat all files as added when no cache exists", async (): Promise<void> => {
      mockStore.get.mockReturnValue(undefined);
      const currentFiles: PublishFile[] = [
        makeFile("notes/a.md", "Content A"),
        makeFile("notes/b.md", "Content B"),
      ];

      const result: FileDiff = await service.computeDiff(currentFiles);

      expect(result.added).toHaveLength(2);
      expect(result.modified).toHaveLength(0);
      expect(result.deleted).toHaveLength(0);
      expect(result.unchanged).toHaveLength(0);
    });

    it("should detect added files", async (): Promise<void> => {
      mockStore.get.mockReturnValue(
        makeCache({
          "notes/unchanged.md": { hash: "", size: 100, lastModified: 1716000000000 },
        }),
      );

      const currentFiles: PublishFile[] = [
        makeFile("notes/new.md", "New content"),
      ];

      const result: FileDiff = await service.computeDiff(currentFiles);

      expect(result.added).toHaveLength(1);
      expect(result.added[0]?.relativePath).toBe("notes/new.md");
      expect(result.modified).toHaveLength(0);
      expect(result.deleted).toHaveLength(1);
      expect(result.unchanged).toHaveLength(0);
    });

    it("should detect deleted files", async (): Promise<void> => {
      mockStore.get.mockReturnValue(
        makeCache({
          "notes/to-delete.md": { hash: "", size: 100, lastModified: 1716000000000 },
        }),
      );

      const currentFiles: PublishFile[] = [];

      const result: FileDiff = await service.computeDiff(currentFiles);

      expect(result.deleted).toContain("notes/to-delete.md");
      expect(result.added).toHaveLength(0);
    });

    it("should detect modified files by hash when mtime differs", async (): Promise<void> => {
      mockStore.get.mockReturnValue(
        makeCache({
          "notes/unchanged.md": { hash: "old-hash", size: 10, lastModified: 1716000000000 },
        }),
      );

      const currentFiles: PublishFile[] = [
        makeFile("notes/unchanged.md", "Modified content", 1716000001000),
      ];

      const result: FileDiff = await service.computeDiff(currentFiles);

      expect(result.modified).toHaveLength(1);
      expect(result.modified[0]?.relativePath).toBe("notes/unchanged.md");
    });

    it("should mark file as unchanged when mtime and size match", async (): Promise<void> => {
      const content: string = "Same content here!";
      mockStore.get.mockReturnValue(
        makeCache({
          "notes/unchanged.md": {
            hash: "some-old-hash",
            size: content.length,
            lastModified: 1716000000000,
          },
        }),
      );

      const currentFiles: PublishFile[] = [
        makeFile("notes/unchanged.md", content, 1716000000000),
      ];

      const result: FileDiff = await service.computeDiff(currentFiles);

      expect(result.unchanged).toContain("notes/unchanged.md");
      expect(result.modified).toHaveLength(0);
      expect(result.added).toHaveLength(0);
    });

    it("should fall back to hash comparison when mtime differs", async (): Promise<void> => {
      const content: string = "Same content";
      const { sha256 } = await import("../../shared/utils/crypto.utils");
      const actualHash: string = await sha256(content);

      mockStore.get.mockReturnValue(
        makeCache({
          "notes/unchanged.md": {
            hash: actualHash,
            size: content.length,
            lastModified: 1716000000000,
          },
        }),
      );

      const currentFiles: PublishFile[] = [
        makeFile("notes/unchanged.md", content, 1716000001000),
      ];

      const result: FileDiff = await service.computeDiff(currentFiles);

      expect(result.unchanged).toContain("notes/unchanged.md");
      expect(result.modified).toHaveLength(0);
    });

    it("should handle empty current files", async (): Promise<void> => {
      mockStore.get.mockReturnValue(
        makeCache({
          "notes/a.md": { hash: "", size: 10, lastModified: 1716000000000 },
          "notes/b.md": { hash: "", size: 10, lastModified: 1716000000000 },
        }),
      );

      const result: FileDiff = await service.computeDiff([]);

      expect(result.added).toHaveLength(0);
      expect(result.modified).toHaveLength(0);
      expect(result.deleted).toHaveLength(2);
      expect(result.unchanged).toHaveLength(0);
    });

    it("should detect files with frontmatter-only changes as modified", async (): Promise<void> => {
      const originalContent: string = `---
title: Same Title
tags: [old]
---
Body content`;

      const modifiedContent: string = `---
title: Same Title
tags: [old, new]
---
Body content`;

      const { sha256 } = await import("../../shared/utils/crypto.utils");
      const originalHash: string = await sha256(originalContent);

      mockStore.get.mockReturnValue(
        makeCache({
          "notes/frontmatter.md": {
            hash: originalHash,
            size: modifiedContent.length + 10,
            lastModified: 1716000000000,
          },
        }),
      );

      const currentFiles: PublishFile[] = [
        makeFile("notes/frontmatter.md", modifiedContent, 1716000001000),
      ];

      const result: FileDiff = await service.computeDiff(currentFiles);

      expect(result.modified).toHaveLength(1);
      expect(result.modified[0]?.relativePath).toBe("notes/frontmatter.md");
    });
  });
});