import type { LoggerPort } from "../ports";
import type { ThemeDefinition } from "../../types/theme.types";
import { ThemeRegistry } from "./theme.registry";

describe("ThemeRegistry", (): void => {
  let mockLogger: jest.Mocked<LoggerPort>;
  let registry: ThemeRegistry;

  beforeEach((): void => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      setLevel: jest.fn(),
    };
    registry = new ThemeRegistry(mockLogger);
  });

  describe("built-in themes", (): void => {
    it("should pre-register built-in themes", (): void => {
      const themes = registry.list();
      expect(themes).toHaveLength(2);
      expect(themes.map((t) => t.id)).toEqual(["default", "dark"]);
    });

    it("should return built-in themes via getBuiltIn", (): void => {
      const builtIn = registry.getBuiltIn();
      expect(builtIn).toHaveLength(2);
      expect(builtIn.every((t) => t.isBuiltIn)).toBe(true);
    });
  });

  describe("register", (): void => {
    it("should register a new theme", (): void => {
      const theme: ThemeDefinition = {
        id: "custom",
        name: "Custom Theme",
        description: "A custom theme",
        isBuiltIn: false,
      };

      registry.register(theme);
      expect(registry.get("custom")).toEqual(theme);
    });

    it("should log a warning when registering a duplicate theme", (): void => {
      const theme: ThemeDefinition = {
        id: "default",
        name: "Default Light",
        description: "Duplicate",
        isBuiltIn: true,
      };

      registry.register(theme);

      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Theme "default" is already registered. Skipping duplicate.',
      );
    });

    it("should not overwrite existing theme on duplicate registration", (): void => {
      const theme: ThemeDefinition = {
        id: "default",
        name: "Duplicated",
        description: "Should not replace",
        isBuiltIn: true,
      };

      registry.register(theme);

      const result = registry.get("default");
      expect(result?.name).toBe("Default Light");
    });
  });

  describe("get", (): void => {
    it("should return undefined for unknown theme", (): void => {
      expect(registry.get("nonexistent")).toBeUndefined();
    });

    it("should return the theme definition for a known theme", (): void => {
      const theme = registry.get("default");
      expect(theme).toBeDefined();
      expect(theme?.id).toBe("default");
    });
  });

  describe("list", (): void => {
    it("should list all registered themes", (): void => {
      const theme: ThemeDefinition = {
        id: "custom",
        name: "Custom",
        description: "",
        isBuiltIn: false,
      };
      registry.register(theme);

      const all = registry.list();
      expect(all).toHaveLength(3);
    });
  });
});
