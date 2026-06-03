import {
  isNonEmptyString,
  isValidGitHubToken,
  isValidUrl,
  isSafeFileName,
  isValidEmail,
  clamp,
} from "./validators";

describe("validators", (): void => {
  describe("isNonEmptyString", (): void => {
    it("should return true for non-empty strings", (): void => {
      expect(isNonEmptyString("hello")).toBe(true);
    });

    it("should return false for empty strings", (): void => {
      expect(isNonEmptyString("")).toBe(false);
      expect(isNonEmptyString("   ")).toBe(false);
    });

    it("should return false for non-string values", (): void => {
      expect(isNonEmptyString(null)).toBe(false);
      expect(isNonEmptyString(undefined)).toBe(false);
      expect(isNonEmptyString(42)).toBe(false);
      expect(isNonEmptyString({})).toBe(false);
    });
  });

  describe("isValidGitHubToken", (): void => {
    it("should accept valid-looking tokens", (): void => {
      expect(isValidGitHubToken("ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx")).toBe(true);
      expect(isValidGitHubToken("github_pat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")).toBe(true);
    });

    it("should reject short tokens", (): void => {
      expect(isValidGitHubToken("short")).toBe(false);
    });

    it("should reject non-string values", (): void => {
      expect(isValidGitHubToken(undefined as unknown as string)).toBe(false);
    });

    it("should reject tokens with invalid characters", (): void => {
      expect(isValidGitHubToken("ghp_xxx-xxx!xxx")).toBe(false);
    });
  });

  describe("isValidUrl", (): void => {
    it("should accept valid http/https URLs", (): void => {
      expect(isValidUrl("https://example.com")).toBe(true);
      expect(isValidUrl("http://localhost:3000")).toBe(true);
    });

    it("should reject invalid strings", (): void => {
      expect(isValidUrl("not-a-url")).toBe(false);
      expect(isValidUrl("")).toBe(false);
    });

    it("should reject non-string values", (): void => {
      expect(isValidUrl(null as unknown as string)).toBe(false);
    });
  });

  describe("isSafeFileName", (): void => {
    it("should accept valid names", (): void => {
      expect(isSafeFileName("My Note.md")).toBe(true);
      expect(isSafeFileName("README")).toBe(true);
      expect(isSafeFileName("中文笔记")).toBe(true);
    });

    it("should reject names with special characters", (): void => {
      expect(isSafeFileName("note<>.txt")).toBe(false);
      expect(isSafeFileName("file?name")).toBe(false);
    });
  });

  describe("isValidEmail", (): void => {
    it("should accept valid emails", (): void => {
      expect(isValidEmail("user@example.com")).toBe(true);
    });

    it("should reject invalid emails", (): void => {
      expect(isValidEmail("not-email")).toBe(false);
      expect(isValidEmail("")).toBe(false);
    });
  });

  describe("clamp", (): void => {
    it("should clamp within bounds", (): void => {
      expect(clamp(5, 0, 10)).toBe(5);
      expect(clamp(-5, 0, 10)).toBe(0);
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });
});
