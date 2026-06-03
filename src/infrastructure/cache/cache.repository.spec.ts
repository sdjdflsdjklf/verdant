import type { PublishCache } from "../../types/cache.types";
import { CacheRepository } from "./cache.repository";

describe("CacheRepository", (): void => {
  let repo: CacheRepository;

  beforeEach((): void => {
    repo = new CacheRepository();
  });

  const sampleCache: PublishCache = {
    version: 1,
    lastPublished: "2026-05-18T10:00:00Z",
    files: {
      "notes/page.md": {
        hash: "abc123",
        size: 1024,
        lastModified: 1716000000000,
      },
    },
    siteConfig: {
      repo: "my-obsidian-garden",
      branch: "gh-pages",
    },
  };

  it("should return null when empty", async (): Promise<void> => {
    const result = await repo.read();
    expect(result).toBeNull();
  });

  it("should write and read a cache entry", async (): Promise<void> => {
    await repo.write(sampleCache);

    const result = await repo.read();
    expect(result).toEqual(sampleCache);
  });

  it("should overwrite an existing cache", async (): Promise<void> => {
    const updated: PublishCache = { ...sampleCache, version: 2 };
    await repo.write(updated);

    const result = await repo.read();
    expect(result?.version).toBe(2);
  });

  it("should clear the cache", async (): Promise<void> => {
    await repo.write(sampleCache);
    await repo.clear();

    const result = await repo.read();
    expect(result).toBeNull();
  });
});
