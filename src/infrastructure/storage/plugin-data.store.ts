import { injectable, inject } from "tsyringe";
import { Plugin } from "obsidian";
import type { KeyValueStorePort } from "../../domain/ports/key-value-store.port";
import type { LoggerPort } from "../../domain/ports/logger.port";
import { DI_TOKENS } from "../../di/tokens";

@injectable()
export class PluginDataStore implements KeyValueStorePort {
  private static sharedData: Record<string, Record<string, unknown>> = {};
  private static sharedLoaded: boolean = false;
  private static sharedPlugin: Plugin | null = null;
  private static sharedLoadingPromise: Promise<void> | null = null;
  private static logger: LoggerPort | null = null;

  private namespace: string | null = null;

  constructor(
    @inject(DI_TOKENS.LoggerService) logger: LoggerPort,
  ) {
    PluginDataStore.logger = logger;
  }

  static setPlugin(plugin: Plugin): void {
    PluginDataStore.sharedPlugin = plugin;
  }

  static create(namespace: string): PluginDataStore {
    const store: PluginDataStore = new PluginDataStore({} as LoggerPort);
    store.namespace = namespace;
    return store;
  }

  async init(): Promise<void> {
    if (PluginDataStore.sharedLoaded) {
      return;
    }

    if (PluginDataStore.sharedLoadingPromise !== null) {
      await PluginDataStore.sharedLoadingPromise;
      return;
    }

    const plugin: Plugin | null = PluginDataStore.sharedPlugin;
    if (plugin === null) {
      PluginDataStore.sharedLoaded = true;
      return;
    }

    PluginDataStore.sharedLoadingPromise = (async (): Promise<void> => {
      const raw: unknown = await plugin.loadData();
      PluginDataStore.sharedData = (raw as Record<string, Record<string, unknown>>) ?? {};
      PluginDataStore.sharedLoaded = true;
    })();

    await PluginDataStore.sharedLoadingPromise;
  }

  get<T>(key: string): T | undefined {
    return this.nsData()[key] as T | undefined;
  }

  set<T>(key: string, value: T): void {
    this.nsData()[key] = value;
    this.persist().catch((err: unknown): void => {
      this.logError("persist failed after set", err);
    });
  }

  delete(key: string): boolean {
    const ns: Record<string, unknown> = this.nsData();
    const existed: boolean = key in ns;
    Reflect.deleteProperty(ns, key);
    if (existed) {
      this.persist().catch((err: unknown): void => {
        this.logError("persist failed after delete", err);
      });
    }
    return existed;
  }

  has(key: string): boolean {
    return key in this.nsData();
  }

  clear(): void {
    if (this.namespace !== null) {
      PluginDataStore.sharedData[this.namespace] = {};
    } else {
      PluginDataStore.logger?.warn("[PluginDataStore] clear() called without namespace — clearing all shared data");
      PluginDataStore.sharedData = {};
    }
    this.persist().catch((err: unknown): void => {
      this.logError("persist failed after clear", err);
    });
  }

  getAll<T>(): Record<string, T> {
    return { ...this.nsData() } as Record<string, T>;
  }

  private nsData(): Record<string, unknown> {
    if (this.namespace !== null) {
      const ns: string = this.namespace;
      if (!PluginDataStore.sharedData[ns]) {
        PluginDataStore.sharedData[ns] = {};
      }
      return PluginDataStore.sharedData[ns];
    }
    return PluginDataStore.sharedData as unknown as Record<string, unknown>;
  }

  private async persist(): Promise<void> {
    const plugin: Plugin | null = PluginDataStore.sharedPlugin;
    if (plugin !== null) {
      await plugin.saveData(PluginDataStore.sharedData);
    }
  }

  private logError(context: string, err: unknown): void {
    const message = err instanceof Error ? err.message : String(err);
    PluginDataStore.logger?.error(`[PluginDataStore] ${context}: ${message}`);
  }
}