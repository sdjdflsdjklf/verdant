import "reflect-metadata";

jest.mock("obsidian", (): object => ({
  Modal: class {
    public contentEl: Record<string, unknown>;
    constructor() {
      this.contentEl = {
        empty: jest.fn(),
        createDiv: jest.fn().mockReturnThis(),
        createEl: jest.fn().mockReturnThis(),
        createSpan: jest.fn().mockReturnThis(),
        addEventListener: jest.fn(),
        setText: jest.fn(),
        setAttr: jest.fn(),
        removeAttribute: jest.fn(),
        style: {},
      };
    }
    open(): void {}
  },
  Notice: jest.fn(),
}), { virtual: true });

jest.mock("../../di/container", (): object => ({
  container: {
    resolve: jest.fn(),
  },
}));

import { PublishModalView } from "./publish-modal.view";
import type { PublishResult } from "../../types/publisher.types";

describe("PublishModalView", (): void => {
  let mockApp: Record<string, unknown>;
  let mockPlugin: Record<string, unknown>;
  let modal: PublishModalView;

  beforeEach((): void => {
    mockApp = {
      workspace: {
        getLeavesOfType: jest.fn().mockReturnValue([]),
      },
    };

    mockPlugin = {
      app: mockApp,
      settings: {
        selectedNotes: [],
        siteTitle: "Test",
        siteDescription: "Test desc",
        githubUsername: "testuser",
        repoName: "test-repo",
        publishBranch: "gh-pages",
        themeId: "default",
        githubToken: "",
      },
    };

    modal = new PublishModalView(mockApp as never, mockPlugin as never);
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  describe("initial state", (): void => {
    it("should create modal instance", (): void => {
      expect(modal).toBeInstanceOf(PublishModalView);
    });
  });

  describe("publish result", (): void => {
    it("should handle success result", (): void => {
      const result: PublishResult = {
        success: true,
        siteUrl: "https://testuser.github.io/test-repo/",
        notesPublished: 5,
        elapsedMs: 3000,
        wasIncremental: false,
      };

      expect(result.success).toBe(true);
      expect(result.siteUrl).toBeDefined();
      expect(result.notesPublished).toBe(5);
    });

    it("should handle error result", (): void => {
      const result: PublishResult = {
        success: false,
        siteUrl: undefined,
        notesPublished: 0,
        elapsedMs: 1000,
        error: "Network error",
        wasIncremental: false,
      };

      expect(result.success).toBe(false);
      expect(result.error).toBe("Network error");
    });
  });
});
