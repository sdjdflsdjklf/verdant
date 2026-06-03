import "reflect-metadata";
import type { PluginSettings } from "../types/plugin.types";
import { DEFAULT_SETTINGS } from "../types/plugin.types";
import { PluginConfigService } from "./plugin-config.service";
import type { KeyValueStorePort } from "../domain/ports";
import type { LoggerPort } from "../domain/ports";

describe("PluginConfigService", (): void => {
  let service: PluginConfigService;
  let mockStore: jest.Mocked<KeyValueStorePort>;
  let mockLogger: jest.Mocked<LoggerPort>;

  const TEST_SETTINGS: Partial<PluginSettings> = {
    githubToken: "ghp_test123",
    githubUsername: "testuser",
    siteTitle: "Test Garden",
    repoName: "test-repo",
  };

  beforeEach((): void => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      setLevel: jest.fn(),
    };
    const storeData: Record<string, unknown> = { ...TEST_SETTINGS };
    mockStore = {
      get: jest.fn((key: string): unknown => storeData[key]),
      set: jest.fn((key: string, value: unknown): void => { storeData[key] = value; }),
      delete: jest.fn((key: string): boolean => {
        const existed = key in storeData;
        Reflect.deleteProperty(storeData, key);
        return existed;
      }),
      has: jest.fn((key: string): boolean => key in storeData),
      clear: jest.fn((): void => { for (const k of Object.keys(storeData)) Reflect.deleteProperty(storeData, k); }),
      getAll: jest.fn((): Record<string, unknown> => ({ ...storeData })),
    } as unknown as jest.Mocked<KeyValueStorePort>;
    service = new PluginConfigService(mockLogger);
  });

  describe("init", (): void => {
    it("should set the store adapter", (): void => {
      expect(() => service.init(mockStore)).not.toThrow();
    });
  });

  describe("load", (): void => {
    it("should return defaults when store is null", async (): Promise<void> => {
      const result: PluginSettings = await service.load();
      expect(result).toEqual(DEFAULT_SETTINGS);
    });

    it("should merge loaded data with defaults", async (): Promise<void> => {
      service.init(mockStore);
      const result: PluginSettings = await service.load();
      expect(result.githubToken).toBe("ghp_test123");
      expect(result.siteTitle).toBe("Test Garden");
      expect(result.publishBranch).toBe("gh-pages");
    });

    it("should handle empty store data", async (): Promise<void> => {
      mockStore.getAll.mockReturnValue({});
      service.init(mockStore);
      const result: PluginSettings = await service.load();
      expect(result.githubToken).toBe("");
      expect(result.publishBranch).toBe("gh-pages");
    });

    it("should update internal state and return a copy", async (): Promise<void> => {
      service.init(mockStore);
      const result: PluginSettings = await service.load();
      expect(result.githubToken).toBe("ghp_test123");
      result.githubToken = "modified";
      expect(service.get("githubToken")).toBe("ghp_test123");
    });

    it("should fall back to defaults on load error", async (): Promise<void> => {
      mockStore.getAll.mockImplementation((): Record<string, never> => { throw new Error("disk error"); });
      service.init(mockStore);
      const result: PluginSettings = await service.load();
      expect(result).toEqual(DEFAULT_SETTINGS);
      expect(mockLogger.error).toHaveBeenCalled();
    });
  });

  describe("save", (): void => {
    it("should call store.set for each setting", async (): Promise<void> => {
      service.init(mockStore);
      await service.load();
      await service.save();
      expect(mockStore.set).toHaveBeenCalled();
    });

    it("should do nothing when store is null", async (): Promise<void> => {
      await expect(service.save()).resolves.toBeUndefined();
    });

    it("should log error and rethrow when set fails", async (): Promise<void> => {
      mockStore.set.mockImplementation((): void => { throw new Error("write error"); });
      service.init(mockStore);
      await service.load();
      await expect(service.save()).rejects.toThrow("write error");
      expect(mockLogger.error).toHaveBeenCalledWith(
        "Failed to save plugin config",
        expect.anything(),
      );
    });
  });

  describe("get", (): void => {
    it("should return the value for a given key", async (): Promise<void> => {
      service.init(mockStore);
      await service.load();
      expect(service.get("githubToken")).toBe("ghp_test123");
      expect(service.get("siteTitle")).toBe("Test Garden");
    });

    it("should return default for unset key", async (): Promise<void> => {
      service.init(mockStore);
      await service.load();
      expect(service.get("publishBranch")).toBe("gh-pages");
    });
  });

  describe("getAll", (): void => {
    it("should return a copy of all settings", async (): Promise<void> => {
      service.init(mockStore);
      await service.load();
      const all: PluginSettings = service.getAll();
      expect(all.githubToken).toBe("ghp_test123");
      all.siteTitle = "Hacked";
      expect(service.get("siteTitle")).toBe("Test Garden");
    });
  });

  describe("set", (): void => {
    beforeEach((): void => {
      jest.useFakeTimers();
    });

    afterEach((): void => {
      jest.useRealTimers();
    });

    it("should update a setting in-memory immediately", async (): Promise<void> => {
      service.init(mockStore);
      await service.load();
      mockStore.set.mockClear();
      const setPromise = service.set("siteTitle", "Updated Garden");
      expect(service.get("siteTitle")).toBe("Updated Garden");
      expect(mockStore.set).not.toHaveBeenCalled();
      jest.advanceTimersByTime(300);
      await setPromise;
      expect(mockStore.set).toHaveBeenCalled();
    });

    it("should notify listeners immediately", async (): Promise<void> => {
      service.init(mockStore);
      await service.load();
      const listener = jest.fn();
      service.onChange(listener);
      const setPromise = service.set("siteTitle", "Notified");
      expect(listener).toHaveBeenCalledWith("siteTitle", "Notified");
      jest.advanceTimersByTime(300);
      await setPromise;
    });

    it("should debounce rapid consecutive sets", async (): Promise<void> => {
      service.init(mockStore);
      await service.load();
      mockStore.set.mockClear();

      void service.set("siteTitle", "Title 1");
      void service.set("siteTitle", "Title 2");
      const finalPromise = service.set("siteTitle", "Title 3");

      jest.advanceTimersByTime(300);
      await finalPromise;

      // save() is called once, which calls set() for each key
      expect(mockStore.set).toHaveBeenCalled();
    });
  });

  describe("update", (): void => {
    it("should batch update multiple settings", async (): Promise<void> => {
      service.init(mockStore);
      await service.load();
      mockStore.set.mockClear();
      await service.update({
        siteTitle: "New Title",
        siteDescription: "New Description",
      });
      expect(service.get("siteTitle")).toBe("New Title");
      expect(service.get("siteDescription")).toBe("New Description");
      expect(mockStore.set).toHaveBeenCalled();
    });

    it("should notify listeners for each changed key", async (): Promise<void> => {
      service.init(mockStore);
      await service.load();
      const listener = jest.fn();
      service.onChange(listener);
      await service.update({
        siteTitle: "T1",
        siteDescription: "D1",
      });
      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenCalledWith("siteTitle", "T1");
      expect(listener).toHaveBeenCalledWith("siteDescription", "D1");
    });
  });

  describe("getSchema", (): void => {
    it("should return schema for existing key", (): void => {
      const schema = service.getSchema("githubToken");
      expect(schema).toBeDefined();
      expect(schema?.label).toBe("GitHub Token");
      expect(schema?.sensitive).toBe(true);
    });

    it("should return undefined for unknown key", (): void => {
      const schema = service.getSchema("nonexistent" as keyof PluginSettings);
      expect(schema).toBeUndefined();
    });
  });

  describe("getSchemaAll", (): void => {
    it("should return all schema entries", (): void => {
      const all = service.getSchemaAll();
      expect(all.length).toBeGreaterThan(0);
      expect(all[0]?.key).toBe("githubToken");
    });

    it("should return a copy (not the original array)", (): void => {
      const first = service.getSchemaAll();
      const second = service.getSchemaAll();
      expect(first).not.toBe(second);
    });
  });

  describe("onChange", (): void => {
    it("should call listener when set is called", async (): Promise<void> => {
      jest.useFakeTimers();
      service.init(mockStore);
      await service.load();
      const listener = jest.fn();
      service.onChange(listener);
      const setPromise = service.set("themeId", "dark");
      expect(listener).toHaveBeenCalledWith("themeId", "dark");
      jest.advanceTimersByTime(300);
      await setPromise;
      jest.useRealTimers();
    });

    it("should stop notifying after unsubscribe", async (): Promise<void> => {
      jest.useFakeTimers();
      service.init(mockStore);
      await service.load();
      const listener = jest.fn();
      const unsubscribe = service.onChange(listener);
      unsubscribe();
      const setPromise = service.set("themeId", "dark");
      expect(listener).not.toHaveBeenCalled();
      jest.advanceTimersByTime(300);
      await setPromise;
      jest.useRealTimers();
    });

    it("should handle unsubscribe when listener not in list", async (): Promise<void> => {
      service.init(mockStore);
      await service.load();
      const listener = jest.fn();
      const unsubscribe = service.onChange(listener);
      unsubscribe();
      expect(() => unsubscribe()).not.toThrow();
    });
  });

  describe("reset", (): void => {
    it("should reset settings to defaults and persist", async (): Promise<void> => {
      service.init(mockStore);
      await service.load();
      expect(service.get("siteTitle")).toBe("Test Garden");
      await service.reset();
      expect(service.get("siteTitle")).toBe(DEFAULT_SETTINGS.siteTitle);
      expect(mockStore.set).toHaveBeenCalled();
    });
  });
});
