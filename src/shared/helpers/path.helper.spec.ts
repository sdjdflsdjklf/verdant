import {
  joinPaths,
  toUrlPath,
  normalizePath,
  parentDir,
  isAbsolutePath,
} from "./path.helper";

describe("path.helper", (): void => {
  describe("joinPaths", (): void => {
    it("should join multiple segments", (): void => {
      expect(joinPaths("a", "b", "c")).toBe("a/b/c");
    });

    it("should collapse double slashes", (): void => {
      expect(joinPaths("a//", "//b")).toBe("a/b");
    });

    it("should filter empty segments", (): void => {
      expect(joinPaths("a", "", "b")).toBe("a/b");
    });

    it("should handle single segment", (): void => {
      expect(joinPaths("a")).toBe("a");
    });
  });

  describe("toUrlPath", (): void => {
    it("should convert file path to URL path", (): void => {
      expect(toUrlPath("My Note.md")).toBe("my-note");
    });

    it("should handle nested paths", (): void => {
      expect(toUrlPath("notes/My Long Note.markdown")).toBe("notes/my-long-note");
    });

    it("should convert backslashes", (): void => {
      expect(toUrlPath("notes\\file.md")).toBe("notes/file");
    });
  });

  describe("normalizePath", (): void => {
    it("should convert backslashes to forward slashes", (): void => {
      expect(normalizePath("a\\b\\c")).toBe("a/b/c");
    });

    it("should remove trailing slash", (): void => {
      expect(normalizePath("a/b/c/")).toBe("a/b/c");
    });

    it("should collapse double slashes", (): void => {
      expect(normalizePath("a//b")).toBe("a/b");
    });
  });

  describe("parentDir", (): void => {
    it("should return parent directory path", (): void => {
      expect(parentDir("a/b/c.md")).toBe("a/b");
    });

    it("should return empty string for top-level files", (): void => {
      expect(parentDir("file.md")).toBe("");
    });
  });

  describe("isAbsolutePath", (): void => {
    it("should detect Unix absolute paths", (): void => {
      expect(isAbsolutePath("/home/user/file.md")).toBe(true);
    });

    it("should detect Windows absolute paths", (): void => {
      expect(isAbsolutePath("C:\\Users\\file.md")).toBe(true);
    });

    it("should return false for relative paths", (): void => {
      expect(isAbsolutePath("relative/path.md")).toBe(false);
    });
  });
});
