import "reflect-metadata";

jest.mock("obsidian", (): object => {
  const mockEl = (): Record<string, unknown> => ({
    empty: jest.fn(),
    createDiv: jest.fn().mockReturnThis(),
    createEl: jest.fn().mockReturnThis(),
    createSpan: jest.fn().mockReturnThis(),
    addEventListener: jest.fn(),
    setText: jest.fn(),
    setAttr: jest.fn(),
    style: {},
  });

  return {
    ItemView: class {
      public contentEl: Record<string, unknown>;
      constructor(_leaf: unknown) {
        this.contentEl = mockEl();
      }
    },
  };
}, { virtual: true });

jest.mock("../../di/container", (): object => ({
  container: {
    resolve: jest.fn().mockReturnValue({
      getAll: jest.fn().mockReturnValue({ selectedNotes: [] }),
      set: jest.fn().mockResolvedValue(undefined),
    }),
  },
}));

import { NoteSelectorView, VIEW_TYPE_NOTE_SELECTOR } from "./note-selector.view";

describe("NoteSelectorView", (): void => {
  let mockPlugin: Record<string, unknown>;
  let mockLeaf: Record<string, unknown>;
  let view: NoteSelectorView;

  beforeEach((): void => {
    mockLeaf = {};
    mockPlugin = {
      app: {
        vault: {
          getMarkdownFiles: jest.fn().mockReturnValue([]),
        },
        workspace: {
          getLeavesOfType: jest.fn().mockReturnValue([]),
        },
      },
      loadData: jest.fn(),
      saveData: jest.fn(),
      settings: { selectedNotes: [] },
      saveSettings: jest.fn(),
    };

    view = new NoteSelectorView(
      mockLeaf as never,
      mockPlugin as never,
    );
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  describe("constants", (): void => {
    it("should have correct view type", (): void => {
      expect(VIEW_TYPE_NOTE_SELECTOR).toBe("verdant-note-selector");
    });

    it("should return correct view type", (): void => {
      expect(view.getViewType()).toBe(VIEW_TYPE_NOTE_SELECTOR);
    });

    it("should return display text", (): void => {
      expect(view.getDisplayText()).toBe("Note Selector");
    });

    it("should return icon", (): void => {
      expect(view.getIcon()).toBe("globe");
    });
  });

  describe("file selection", (): void => {
    it("should start with empty selection", (): void => {
      expect(view.getSelectedFiles()).toEqual([]);
    });

    it("should return selected files as array", (): void => {
      const files = view.getSelectedFiles();
      expect(Array.isArray(files)).toBe(true);
    });
  });

  describe("publish callback", (): void => {
    it("should have nullable onPublishRequest property", (): void => {
      expect(view.onPublishRequest).toBeNull();
    });

    it("should accept a callback function", (): void => {
      const callback = jest.fn();
      view.onPublishRequest = callback;
      view.onPublishRequest();
      expect(callback).toHaveBeenCalled();
    });
  });
});
