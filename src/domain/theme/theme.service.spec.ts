import type { LoggerPort } from "../ports";
import { ThemeRegistry } from "./theme.registry";
import { ThemeRenderer } from "./theme.renderer";
import { ThemeService } from "./theme.service";

describe("ThemeService", (): void => {
  let mockLogger: jest.Mocked<LoggerPort>;
  let registry: ThemeRegistry;
  let renderer: ThemeRenderer;
  let service: ThemeService;

  beforeEach((): void => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      setLevel: jest.fn(),
    };
    registry = new ThemeRegistry(mockLogger);
    renderer = new ThemeRenderer();
    service = new ThemeService(registry, renderer, mockLogger);
  });

  describe("getActiveTheme", (): void => {
    it("should return 'default' theme by default", (): void => {
      const theme = service.getActiveTheme();
      expect(theme.id).toBe("default");
      expect(theme.name).toBe("Default Light");
    });

    it("should fallback to default theme definition when active theme is missing from registry", (): void => {
      jest.spyOn(registry, "get").mockReturnValueOnce(undefined);

      const theme = service.getActiveTheme();

      expect(theme).toEqual({
        id: "default",
        name: "Default Light",
        description: "",
        isBuiltIn: true,
      });
    });
  });

  describe("setActiveTheme", (): void => {
    it("should switch active theme", (): void => {
      service.setActiveTheme("dark");
      expect(service.getActiveTheme().id).toBe("dark");
    });

    it("should throw for unknown theme", (): void => {
      expect((): void => {
        service.setActiveTheme("unknown");
      }).toThrow('Theme "unknown" not found');
    });

    it("should log when switching theme", (): void => {
      service.setActiveTheme("dark");
      expect(mockLogger.info).toHaveBeenCalledWith('Active theme set to "dark"');
    });
  });

  describe("applyTheme", (): void => {
    it("should apply a valid theme", async (): Promise<void> => {
      const config = await service.applyTheme("dark");
      expect(config).toEqual({});
      expect(service.getActiveTheme().id).toBe("dark");
    });

    it("should throw for unknown theme", async (): Promise<void> => {
      await expect(service.applyTheme("unknown")).rejects.toThrow(
        'Theme "unknown" not found',
      );
    });
  });

  describe("getThemeCSS", (): void => {
    it("should return cached CSS for known theme", async (): Promise<void> => {
      service.setThemeCSS("default", "body { color: red; }");
      const css = await service.getThemeCSS("default");
      expect(css).toBe("body { color: red; }");
    });

    it("should fallback to renderer CSS when not cached", async (): Promise<void> => {
      const css = await service.getThemeCSS("default");
      expect(css.length).toBeGreaterThan(0);
    });

    it("should throw for unknown theme", async (): Promise<void> => {
      await expect(service.getThemeCSS("unknown")).rejects.toThrow(
        'Theme "unknown" not found',
      );
    });
  });
});
