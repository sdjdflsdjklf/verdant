import { StorageRepository } from "./storage.repository";

describe("StorageRepository", (): void => {
  let repo: StorageRepository;

  beforeEach((): void => {
    repo = new StorageRepository();
  });

  it("should return undefined for missing keys", (): void => {
    const value: string | undefined = repo.get("nonexistent");
    expect(value).toBeUndefined();
  });

  it("should store and retrieve values", (): void => {
    repo.set("key1", "hello");
    const value: string | undefined = repo.get<string>("key1");
    expect(value).toBe("hello");
  });

  it("should store complex objects", (): void => {
    const obj = { a: 1, b: [2, 3] };
    repo.set("obj", obj);
    const value: typeof obj | undefined = repo.get<typeof obj>("obj");
    expect(value).toEqual(obj);
  });

  it("should delete values", (): void => {
    repo.set("temp", "value");
    const deleted: boolean = repo.delete("temp");
    expect(deleted).toBe(true);
    expect(repo.get("temp")).toBeUndefined();
  });

  it("should check has", (): void => {
    repo.set("exists", true);
    expect(repo.has("exists")).toBe(true);
    expect(repo.has("missing")).toBe(false);
  });

  it("should clear all values", (): void => {
    repo.set("a", 1);
    repo.set("b", 2);
    repo.clear();
    expect(repo.get("a")).toBeUndefined();
    expect(repo.get("b")).toBeUndefined();
  });
});
