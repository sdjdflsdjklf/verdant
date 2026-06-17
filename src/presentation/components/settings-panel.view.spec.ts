import "reflect-metadata";

jest.mock("obsidian", (): object => ({
  PluginSettingTab: class {
    public containerEl: Record<string, unknown>;
    constructor() {
      this.containerEl = {
        empty: jest.fn(),
        createEl: jest.fn().mockReturnThis(),
        createDiv: jest.fn().mockReturnThis(),
        createSpan: jest.fn().mockReturnThis(),
        setText: jest.fn(),
      };
    }
  },
  Setting: class {
    readonly nameEl: { createSpan: jest.Mock };

    private textComponents: Array<Record<string, unknown>> = [];

    private buttonComponents: Array<Record<string, unknown>> = [];

    private dropdownComponents: Array<Record<string, unknown>> = [];

    private textAreaComponents: Array<Record<string, unknown>> = [];

    constructor() {
      this.nameEl = {
        createSpan: jest.fn().mockReturnValue({
          title: "",
          addClass: jest.fn(),
        }),
      };
    }

    setName(_n: string): this {
      return this;
    }
    setHeading(): this {
      return this;
    }
    setDesc(_d: string): this {
      return this;
    }
    addText(cb: (text: Record<string, unknown>) => void): this {
      const textComp = {
        setPlaceholder: jest.fn().mockReturnThis(),
        setValue: jest.fn().mockReturnThis(),
        setDisabled: jest.fn().mockReturnThis(),
        onChange: jest.fn(),
        inputEl: { type: "text" },
      };
      this.textComponents.push(textComp);
      cb(textComp);
      return this;
    }
    addTextArea(cb: (text: Record<string, unknown>) => void): this {
      const textComp = {
        setPlaceholder: jest.fn().mockReturnThis(),
        setValue: jest.fn().mockReturnThis(),
        onChange: jest.fn(),
      };
      this.textAreaComponents.push(textComp);
      cb(textComp);
      return this;
    }
    addButton(cb: (btn: Record<string, unknown>) => void): this {
      const btnComp = {
        setButtonText: jest.fn().mockReturnThis(),
        onClick: jest.fn(),
      };
      this.buttonComponents.push(btnComp);
      cb(btnComp);
      return this;
    }
    addDropdown(cb: (dropdown: Record<string, unknown>) => void): this {
      const dropdownComp = {
        addOption: jest.fn().mockReturnThis(),
        setValue: jest.fn().mockReturnThis(),
        onChange: jest.fn(),
      };
      this.dropdownComponents.push(dropdownComp);
      cb(dropdownComp);
      return this;
    }
  },
  Notice: jest.fn(),
}), { virtual: true });

jest.mock("../../di/container", (): object => {
  const mockContainer = {
    resolve: jest.fn(),
  };
  return { container: mockContainer };
});

import { container } from "../../di/container";
import { DI_TOKENS } from "../../di/tokens";
import type { AuthResult } from "../../types/github.types";
import type { ThemeDefinition } from "../../types/theme.types";
import type { SettingsPanelView as SettingsPanelViewType } from "./settings-panel.view";

describe("SettingsPanelView", (): void => {
  let mockApp: Record<string, unknown>;
  let mockPlugin: Record<string, unknown>;

  beforeEach((): void => {
    mockApp = { workspace: {} };
    mockPlugin = {
      app: mockApp,
      settings: {
        githubToken: "",
        githubUsername: "",
        repoName: "my-garden-site",
        publishBranch: "gh-pages",
        siteTitle: "My Verdant Site",
        siteDescription: "A verdant site",
        themeId: "default",
        selectedNotes: [],
      },
      saveSettings: jest.fn(),
    };

    // Set up default container resolves
    (container.resolve as jest.Mock).mockImplementation((token: symbol): unknown => {
      if (token === DI_TOKENS.GitHubAuthService) {
        return {
          validateToken: jest.fn(),
        };
      }
      if (token === DI_TOKENS.ThemeRegistry) {
        return {
          list: jest.fn().mockReturnValue([
            { id: "default", name: "Default Light", description: "", isBuiltIn: true },
            { id: "dark", name: "Dark Mode", description: "", isBuiltIn: true },
          ]),
        };
      }
      if (token === DI_TOKENS.PluginConfigService) {
        return {
          getAll: jest.fn().mockReturnValue(mockPlugin.settings),
          get: jest.fn(),
          set: jest.fn(),
        };
      }
      return undefined;
    });
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  it("should not throw when display is called", (): void => {
    const mod = jest.requireActual("./settings-panel.view") as {
      SettingsPanelView: new (app: unknown, plugin: unknown) => SettingsPanelViewType;
    };
    const panel = new mod.SettingsPanelView(mockApp, mockPlugin);
    expect(() => panel.display()).not.toThrow();
  });

  describe("service integration", (): void => {
    it("should resolve GithubAuthService from container", (): void => {
      const mockAuthResult: AuthResult = {
        valid: true,
        username: "testuser",
      };
      const mockAuthService = {
        validateToken: jest.fn().mockResolvedValue(mockAuthResult),
      };
      (container.resolve as jest.Mock).mockReturnValue(mockAuthService);

      const resolved = container.resolve(DI_TOKENS.GitHubAuthService);
      expect(resolved).toBe(mockAuthService);
    });
  });

  describe("theme integration", (): void => {
    it("should handle theme registry resolution", (): void => {
      const mockThemes: ThemeDefinition[] = [
        { id: "default", name: "Default Light", description: "", isBuiltIn: true },
        { id: "dark", name: "Dark Mode", description: "", isBuiltIn: true },
      ];
      const mockRegistry = {
        list: jest.fn().mockReturnValue(mockThemes),
      };
      (container.resolve as jest.Mock).mockReturnValue(mockRegistry);

      const registry = container.resolve<{ list: () => ThemeDefinition[] }>(
        DI_TOKENS.ThemeRegistry,
      );
      expect(registry.list()).toEqual(mockThemes);
    });
  });
});
