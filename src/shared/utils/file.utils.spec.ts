import {
  getExtension,
  stripExtension,
  sanitizeFileName,
  isMarkdownFile,
  toRelativePath,
} from "./file.utils";

describe("file.utils", (): void => {
  describe("getExtension", (): void => {
    it("should return extension from file path", (): void => {
      expect(getExtension("note.md")).toBe(".md");
      expect(getExtension("path/to/file.markdown")).toBe(".markdown");
    });

    it("should return empty string for files without extension", (): void => {
      expect(getExtension("README")).toBe("");
      expect(getExtension("path/to/README")).toBe("");
    });

    it("should detect extensions starting with dot", (): void => {
      // Hidden files like .gitignore have an extension of .gitignore
      expect(getExtension(".gitignore")).toBe(".gitignore");
      expect(getExtension("/path/.hidden")).toBe(".hidden");
    });

    it("should return empty string when dot is before last slash", (): void => {
      expect(getExtension("/path.to/file")).toBe("");
      expect(getExtension("C:\\path.to\\file")).toBe("");
    });
  });

  describe("stripExtension", (): void => {
    it("should remove file extension", (): void => {
      expect(stripExtension("note.md")).toBe("note");
      expect(stripExtension("path/to/file.markdown")).toBe("path/to/file");
    });

    it("should return unchanged if no extension", (): void => {
      expect(stripExtension("README")).toBe("README");
    });
  });

  describe("sanitizeFileName", (): void => {
    it("should convert spaces to hyphens", (): void => {
      expect(sanitizeFileName("My Note")).toBe("my-note");
    });

    it("should lowercase the name", (): void => {
      expect(sanitizeFileName("HELLO")).toBe("hello");
    });

    it("should remove special characters", (): void => {
      // Special chars are replaced with hyphens, then collapsed
      expect(sanitizeFileName("hello!@#$world")).toBe("hello-world");
    });

    it("should preserve CJK characters", (): void => {
      expect(sanitizeFileName("中文笔记")).toBe("中文笔记");
    });

    it("should collapse multiple hyphens", (): void => {
      expect(sanitizeFileName("a---b")).toBe("a-b");
    });

    it("should trim leading and trailing hyphens", (): void => {
      expect(sanitizeFileName("-hello-")).toBe("hello");
    });
  });

  describe("isMarkdownFile", (): void => {
    it("should return true for .md files", (): void => {
      expect(isMarkdownFile("index.md")).toBe(true);
    });

    it("should return true for .markdown files", (): void => {
      expect(isMarkdownFile("readme.markdown")).toBe(true);
    });

    it("should return true for .mdx files", (): void => {
      expect(isMarkdownFile("component.mdx")).toBe(true);
    });

    it("should return false for non-markdown files", (): void => {
      expect(isMarkdownFile("image.png")).toBe(false);
      expect(isMarkdownFile("style.css")).toBe(false);
    });
  });

  describe("toRelativePath", (): void => {
    it("should convert absolute path to relative", (): void => {
      const result = toRelativePath("/vault/notes/file.md", "/vault");
      expect(result).toBe("notes/file.md");
    });

    it("should handle Windows backslashes", (): void => {
      const result = toRelativePath("C:\\vault\\notes\\file.md", "C:\\vault");
      expect(result).toBe("notes/file.md");
    });

    it("should return absolute path if not under base", (): void => {
      const result = toRelativePath("/other/path.md", "/vault");
      expect(result).toBe("/other/path.md");
    });
  });
});
