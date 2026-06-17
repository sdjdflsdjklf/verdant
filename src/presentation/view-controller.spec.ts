import "reflect-metadata";
import type { Plugin, WorkspaceLeaf } from "obsidian";
import { ViewController } from "./view-controller";
import { VIEW_TYPE_NOTE_SELECTOR } from "./components/note-selector.view";
import type { LoggerPort } from "../domain/ports";

// Mock the views
jest.mock("./components/note-selector.view", (): object => ({
  NoteSelectorView: jest.fn().mockImplementation(() => ({
    getViewType: jest.fn().mockReturnValue("verdant-note-selector"),
    getDisplayText: jest.fn().mockReturnValue("Note Selector"),
    getIcon: jest.fn().mockReturnValue("globe"),
    onOpen: jest.fn().mockResolvedValue(undefined),
    getSelectedFiles: jest.fn().mockReturnValue([]),
  })),
  VIEW_TYPE_NOTE_SELECTOR: "verdant-note-selector",
}));

jest.mock("./components/publish-wizard.view", (): object => ({
  PublishWizardView: jest.fn().mockImplementation(() => ({
    onOpen: jest.fn(),
    open: jest.fn(),
  })),
}));

describe("ViewController", (): void => {
  let controller: ViewController;
  let mockLogger: jest.Mocked<LoggerPort>;
  let mockPlugin: jest.Mocked<Plugin>;

  beforeEach((): void => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      setLevel: jest.fn(),
    };

    mockPlugin = {
      registerView: jest.fn(),
      app: {
        workspace: {
          getLeavesOfType: jest.fn().mockReturnValue([]),
          getRightLeaf: jest.fn(),
          revealLeaf: jest.fn(),
        },
      },
    } as unknown as jest.Mocked<Plugin>;

    controller = new ViewController(mockLogger);
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  describe("registerViews", (): void => {
    it("should register the note selector view", (): void => {
      controller.registerViews(mockPlugin);

      expect(mockPlugin.registerView).toHaveBeenCalledWith(
        VIEW_TYPE_NOTE_SELECTOR,
        expect.any(Function),
      );
    });

    it("should log view registration", (): void => {
      controller.registerViews(mockPlugin);

      expect(mockLogger.info).toHaveBeenCalledWith("Views registered");
    });

    it("should invoke factory callback to create view and wire onPublishRequest", (): void => {
      const mockLeaf: WorkspaceLeaf = {} as WorkspaceLeaf;

      controller.registerViews(mockPlugin);

      const calls = mockPlugin.registerView.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      const factory = calls[0]?.[1] as unknown as
        ((leaf: WorkspaceLeaf) => Record<string, unknown>) | undefined;

      expect(factory).toBeDefined();
      if (factory !== undefined) {
        const view: Record<string, unknown> = factory(mockLeaf);
        expect(view).toHaveProperty("onPublishRequest");
        expect(typeof view.onPublishRequest).toBe("function");
      }
    });

    it("should open publish modal when onPublishRequest is triggered", (): void => {
      const mockLeaf: WorkspaceLeaf = {} as WorkspaceLeaf;
      const PublishWizardViewMock = jest.requireMock(
        "./components/publish-wizard.view",
      ).PublishWizardView as jest.Mock;
      const mockOpen = jest.fn();
      PublishWizardViewMock.mockImplementation(() => ({
        open: mockOpen,
      }));

      controller.registerViews(mockPlugin);

      const calls = mockPlugin.registerView.mock.calls;
      expect(calls.length).toBeGreaterThan(0);
      const factory = calls[0]?.[1] as unknown as
        ((leaf: WorkspaceLeaf) => Record<string, unknown>) | undefined;

      expect(factory).toBeDefined();
      if (factory !== undefined) {
        const view: Record<string, unknown> = factory(mockLeaf);
        (view.onPublishRequest as () => void)();

        expect(PublishWizardViewMock).toHaveBeenCalledWith(
          mockPlugin.app,
        );
        expect(mockOpen).toHaveBeenCalled();
      }
    });
  });

  describe("activateNoteSelector", (): void => {
    it("should reveal existing leaf if already open", async (): Promise<void> => {
      const mockLeaf = { dummy: true } as unknown as WorkspaceLeaf;
      mockPlugin.app.workspace.getLeavesOfType = jest
        .fn()
        .mockReturnValue([mockLeaf]);

      await controller.activateNoteSelector(mockPlugin);

      expect(mockPlugin.app.workspace.revealLeaf).toHaveBeenCalledWith(
        mockLeaf,
      );
    });

    it("should create new leaf if none exists", async (): Promise<void> => {
      mockPlugin.app.workspace.getLeavesOfType = jest.fn().mockReturnValue([]);
      const mockLeaf = {
        setViewState: jest.fn().mockResolvedValue(undefined),
      } as unknown as WorkspaceLeaf;
      mockPlugin.app.workspace.getRightLeaf = jest.fn().mockReturnValue(mockLeaf);

      await controller.activateNoteSelector(mockPlugin);

      expect(mockPlugin.app.workspace.getRightLeaf).toHaveBeenCalledWith(false);
    });

    it("should not throw if getRightLeaf returns null", async (): Promise<void> => {
      mockPlugin.app.workspace.getLeavesOfType = jest.fn().mockReturnValue([]);
      mockPlugin.app.workspace.getRightLeaf = jest.fn().mockReturnValue(null);

      await expect(
        controller.activateNoteSelector(mockPlugin),
      ).resolves.not.toThrow();
    });
  });

  describe("openPublishModal", (): void => {
    it("should open publish wizard", (): void => {
      const PublishWizardViewMock = jest.requireMock(
        "./components/publish-wizard.view",
      ).PublishWizardView as jest.Mock;
      const mockOpen = jest.fn();
      PublishWizardViewMock.mockImplementation(() => ({
        open: mockOpen,
      }));

      controller.openPublishModal(mockPlugin);

      expect(mockOpen).toHaveBeenCalled();
    });
  });
});
