import { VaultRepository } from "./vault.repository";
import type { App, TFile } from "obsidian";
import type { PublishFile } from "../../types/publisher.types";

function createMockApp(files: Map<string, { content: string; mtime: number; binary?: ArrayBuffer }>): App {
  const getFileByPath = (path: string): TFile | null => {
    const entry = files.get(path);
    if (entry === undefined) return null;
    return {
      path,
      stat: { mtime: entry.mtime, ctime: 0, size: entry.content.length },
      basename: path.split("/").pop()?.replace(/\.md$/, "") ?? "",
      extension: "md",
      name: path.split("/").pop() ?? "",
      parent: null,
      vault: null as unknown as App["vault"],
    } as TFile;
  };

  return {
    vault: {
      getFileByPath,
      getMarkdownFiles: (): TFile[] => {
        const result: TFile[] = [];
        for (const p of files.keys()) {
          const tf = getFileByPath(p);
          if (tf !== null) result.push(tf);
        }
        return result;
      },
      read: async (file: TFile): Promise<string> => {
        const entry = files.get(file.path);
        if (entry === undefined) throw new Error("Not found");
        return entry.content;
      },
      readBinary: async (file: TFile): Promise<ArrayBuffer> => {
        const entry = files.get(file.path);
        if (entry === undefined) throw new Error("Not found");
        return entry.binary ?? new ArrayBuffer(0);
      },
    },
  } as unknown as App;
}

describe("VaultRepository", (): void => {
  it("readFile should return file content", async (): Promise<void> => {
    const files = new Map<string, { content: string; mtime: number }>([
      ["notes/test.md", { content: "# Hello World", mtime: 1000 }],
    ]);
    const repo = new VaultRepository(createMockApp(files));

    const result: string = await repo.readFile("notes/test.md");
    expect(result).toBe("# Hello World");
  });

  it("readFile should throw on missing file", async (): Promise<void> => {
    const files = new Map<string, { content: string; mtime: number }>();
    const repo = new VaultRepository(createMockApp(files));

    await expect(repo.readFile("missing.md")).rejects.toThrow(
      "File not found: missing.md",
    );
  });

  it("exists should return true for existing file", async (): Promise<void> => {
    const files = new Map<string, { content: string; mtime: number }>([
      ["existing.md", { content: "hello", mtime: 100 }],
    ]);
    const repo = new VaultRepository(createMockApp(files));

    const result: boolean = await repo.exists("existing.md");
    expect(result).toBe(true);
  });

  it("exists should return false for missing file", async (): Promise<void> => {
    const files = new Map<string, { content: string; mtime: number }>();
    const repo = new VaultRepository(createMockApp(files));

    const result: boolean = await repo.exists("nope.md");
    expect(result).toBe(false);
  });

  it("listMarkdownFiles should return all file paths", async (): Promise<void> => {
    const files = new Map<string, { content: string; mtime: number }>([
      ["a.md", { content: "a", mtime: 1 }],
      ["b.md", { content: "b", mtime: 2 }],
      ["sub/c.md", { content: "c", mtime: 3 }],
    ]);
    const repo = new VaultRepository(createMockApp(files));

    const result: string[] = await repo.listMarkdownFiles();
    expect(result).toEqual(expect.arrayContaining(["a.md", "b.md", "sub/c.md"]));
    expect(result).toHaveLength(3);
  });

  it("getPublishFile should return full PublishFile metadata", async (): Promise<void> => {
    const files = new Map<string, { content: string; mtime: number }>([
      ["notes/hello.md", { content: "# Hello", mtime: 5000 }],
    ]);
    const repo = new VaultRepository(createMockApp(files));

    const result: PublishFile = await repo.getPublishFile("notes/hello.md");

    expect(result.relativePath).toBe("notes/hello.md");
    expect(result.absolutePath).toBe("notes/hello.md");
    expect(result.content).toBe("# Hello");
    expect(result.mtime).toBe(5000);
    expect(result.hash).toBeDefined();
    expect(result.hash.length).toBeGreaterThan(0);
  });

  it("getPublishFile should throw on missing file", async (): Promise<void> => {
    const files = new Map<string, { content: string; mtime: number }>();
    const repo = new VaultRepository(createMockApp(files));

    await expect(repo.getPublishFile("gone.md")).rejects.toThrow(
      "File not found: gone.md",
    );
  });

  it("readBinary should return ArrayBuffer for binary file", async (): Promise<void> => {
    const binaryData = new Uint8Array([0x89, 0x50, 0x4e, 0x47]).buffer;
    const files = new Map<string, { content: string; mtime: number; binary?: ArrayBuffer }>([
      ["images/test.png", { content: "", mtime: 1000, binary: binaryData }],
    ]);
    const repo = new VaultRepository(createMockApp(files));

    const result: ArrayBuffer = await repo.readBinary("images/test.png");
    expect(result).toBe(binaryData);
    expect(result.byteLength).toBe(4);
  });

  it("readBinary should throw on missing file", async (): Promise<void> => {
    const files = new Map<string, { content: string; mtime: number; binary?: ArrayBuffer }>();
    const repo = new VaultRepository(createMockApp(files));

    await expect(repo.readBinary("missing.png")).rejects.toThrow(
      "File not found: missing.png",
    );
  });
});
