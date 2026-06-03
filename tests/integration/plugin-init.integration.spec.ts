import "reflect-metadata";
import { container } from "../../src/di/container";
import { DI_TOKENS } from "../../src/di/tokens";
import { registerInfrastructure } from "../../src/di/registrations";
import { PluginInitializer } from "../../src/bootstrap/plugin-initializer";
import { ErrorBoundary } from "../../src/bootstrap/error-boundary";
import { FeatureGate } from "../../src/bootstrap/feature-gate";
import type { PluginSettings } from "../../src/types/plugin.types";
import { DEFAULT_SETTINGS } from "../../src/types/plugin.types";
import { LicenseService } from "../../src/domain/license/license.service";
import { ThemeRegistry } from "../../src/domain/theme/theme.registry";
import { MockPlugin } from "../mocks/obsidian-api.mock";
import type { LoggerPort } from "../../src/domain/ports";

describe("PluginInitializer", () => {
  beforeEach(() => {
    container.reset();
  });

  it("should initialize without errors with valid settings", async () => {
    registerInfrastructure();
    container.registerSingleton(DI_TOKENS.LicenseService, LicenseService);
    container.registerSingleton(DI_TOKENS.ThemeRegistry, ThemeRegistry);
    container.registerSingleton(DI_TOKENS.FeatureGate, FeatureGate);

    const initializer = container.resolve(PluginInitializer);
    const plugin = new MockPlugin();
    const settings: PluginSettings = { ...DEFAULT_SETTINGS };

    await expect(initializer.initialize(plugin, settings)).resolves.toBeUndefined();
  });

  it("should have FeatureGate registered after initialization", async () => {
    registerInfrastructure();
    container.registerSingleton(DI_TOKENS.LicenseService, LicenseService);
    container.registerSingleton(DI_TOKENS.ThemeRegistry, ThemeRegistry);
    container.registerSingleton(DI_TOKENS.FeatureGate, FeatureGate);

    const initializer = container.resolve(PluginInitializer);
    const plugin = new MockPlugin();
    const settings: PluginSettings = { ...DEFAULT_SETTINGS };

    await initializer.initialize(plugin, settings);

    const featureGate = container.resolve(FeatureGate);
    expect(featureGate).toBeDefined();
    expect(featureGate.maxNotes()).toBe(10);
    expect(featureGate.canPublishUnlimited()).toBe(false);
  });
});

describe("ErrorBoundary", () => {
  const mockLogger: LoggerPort = {
    setLevel: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  it("should return result on successful operation", async () => {
    const result = await ErrorBoundary.wrap(
      async () => "success",
      "test",
      mockLogger,
    );
    expect(result).toBe("success");
  });

  it("should rethrow error on failed operation", async () => {
    const testError = new Error("test error");
    await expect(
      ErrorBoundary.wrap(
        async () => {
          throw testError;
        },
        "test",
        mockLogger,
      ),
    ).rejects.toThrow("test error");
    expect(mockLogger.error).toHaveBeenCalledWith("[test] test error");
  });

  it("should return fallback on safeExecute", async () => {
    const result = await ErrorBoundary.safeExecute(
      async () => {
        throw new Error("fail");
      },
      "fallback-value",
      mockLogger,
      "test",
    );
    expect(result).toBe("fallback-value");
  });
});

describe("PluginInitializer - license key scenarios", () => {
  beforeEach(() => {
    container.reset();
    registerInfrastructure();
    container.registerSingleton(DI_TOKENS.LicenseService, LicenseService);
    container.registerSingleton(DI_TOKENS.ThemeRegistry, ThemeRegistry);
    container.registerSingleton(DI_TOKENS.FeatureGate, FeatureGate);
  });

  it("should handle license activation failure gracefully when key is invalid", async () => {
    const initializer = container.resolve(PluginInitializer);
    const plugin = new MockPlugin();
    const settings: PluginSettings = {
      ...DEFAULT_SETTINGS,
      licenseKey: "aW52YWxpZA==",
    };

    await expect(
      initializer.initialize(plugin, settings),
    ).resolves.toBeUndefined();
  });
});

describe("FeatureGate", () => {
  let mockLicenseService: LicenseService;

  beforeEach(() => {
    container.reset();
    container.registerInstance(DI_TOKENS.LoggerService, {
      setLevel: jest.fn(),
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    } as LoggerPort);
    container.registerSingleton(DI_TOKENS.LicenseService, LicenseService);
    container.registerSingleton(DI_TOKENS.FeatureGate, FeatureGate);

    mockLicenseService = container.resolve(LicenseService);
  });

  it("should disable pro features when no license activated", () => {
    const gate = new FeatureGate(mockLicenseService);
    expect(gate.canPublishUnlimited()).toBe(false);
    expect(gate.maxNotes()).toBe(10);
  });
});
