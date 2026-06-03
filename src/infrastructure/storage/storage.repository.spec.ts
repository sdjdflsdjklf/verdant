import { StorageRepository } from "./storage.repository";

describe("StorageRepository", (): void => {
  let repo: StorageRepository;

  beforeEach((): void => {
    repo = new StorageRepository();
  });

  it("should return null for missing keys", async (): Promise<void> => {
    const value = await repo.get("nonexistent");
    expect(value).toBeNull();
  });

  it("should store and retrieve values", async (): Promise<void> => {
    await repo.set("key1", "hello");
    const value = await repo.get<string>("key1");
    expect(value).toBe("hello");
  });

  it("should store complex objects", async (): Promise<void> => {
    const obj = { a: 1, b: [2, 3] };
    await repo.set("obj", obj);
    const value = await repo.get<typeof obj>("obj");
    expect(value).toEqual(obj);
  });

  it("should delete values", async (): Promise<void> => {
    await repo.set("temp", "value");
    await repo.delete("temp");
    const value = await repo.get("temp");
    expect(value).toBeNull();
  });

  it("should handle non-string JSON gracefully on get", async (): Promise<void> => {
    // Manually inject invalid JSON into the internal store
    const repoAny = repo as unknown as { store: Map<string, string> };
    repoAny.store.set("bad", "not-json");

    const value = await repo.get("bad");
    expect(value).toBeNull();
  });
});
