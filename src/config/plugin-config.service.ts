import { injectable, inject } from "tsyringe";
import type { PluginSettings } from "../types/plugin.types";
import { DEFAULT_SETTINGS } from "../types/plugin.types";
import type { LoggerPort, KeyValueStorePort } from "../domain/ports";
import { DI_TOKENS } from "../di/tokens";
import { ErrorBoundary } from "../bootstrap/error-boundary";
import { CONFIG_SCHEMA, type ConfigFieldDescriptor } from "./config.schema";

export type ConfigChangeListener = (key: keyof PluginSettings, value: unknown) => void;

@injectable()
export class PluginConfigService {
  private static readonly DEBOUNCE_MS = 300;

  private settings: PluginSettings = { ...DEFAULT_SETTINGS };
  private store: KeyValueStorePort | null = null;
  private listeners: ConfigChangeListener[] = [];
  private savePromise: Promise<void> = Promise.resolve();
  private saveTimer?: number;
  private pendingResolve?: () => void;

  constructor(
    @inject(DI_TOKENS.LoggerService) private readonly logger: LoggerPort,
  ) {}

  /** Initialize with the key-value store for persistence. */
  init(store: KeyValueStorePort): void {
    this.store = store;
  }

  /** Load settings from persistent storage, merging with defaults. */
  async load(): Promise<PluginSettings> {
    if (this.store === null) {
      return { ...DEFAULT_SETTINGS };
    }
    const store = this.store;
    return ErrorBoundary.safeExecute(
      async (): Promise<PluginSettings> => {
        const raw = store.getAll<Partial<PluginSettings>>();
        this.settings = { ...DEFAULT_SETTINGS, ...raw };
        return { ...this.settings };
      },
      { ...DEFAULT_SETTINGS },
      this.logger,
      "PluginConfigService.load",
    );
  }

  /** Save current settings to persistent storage. */
  async save(): Promise<void> {
    if (this.store === null) {
      return;
    }
    if (this.saveTimer !== undefined) {
      window.clearTimeout(this.saveTimer);
      this.saveTimer = undefined;
      this.pendingResolve?.();
      this.pendingResolve = undefined;
    }
    const snapshot: PluginSettings = { ...this.settings };
    const store = this.store;
    this.savePromise = this.savePromise.then(async (): Promise<void> => {
      for (const [key, value] of Object.entries(snapshot)) {
        store.set(key, value);
      }
    }).catch((error: unknown): void => {
      this.logger.error('Failed to save plugin config', error);
      throw error;
    });
    await this.savePromise;
  }

  /** Get a single setting value. */
  get<K extends keyof PluginSettings>(key: K): PluginSettings[K] {
    return this.settings[key];
  }

  /** Get all settings (immutable copy). */
  getAll(): PluginSettings {
    return { ...this.settings };
  }

  /** Set a single setting value with debounced persistence. */
  async set<K extends keyof PluginSettings>(key: K, value: PluginSettings[K]): Promise<void> {
    this.settings[key] = value;
    for (const listener of this.listeners) {
      listener(key, value);
    }
    if (this.saveTimer !== undefined) {
      window.clearTimeout(this.saveTimer);
      this.pendingResolve?.();
    }
    return new Promise<void>((resolve) => {
      this.pendingResolve = resolve;
      this.saveTimer = window.setTimeout(() => {
        this.saveTimer = undefined;
        this.pendingResolve = undefined;
        void this.save().finally(() => resolve());
      }, PluginConfigService.DEBOUNCE_MS);
    });
  }

  /** Batch update multiple settings at once. */
  async update(partial: Partial<PluginSettings>): Promise<void> {
    Object.assign(this.settings, partial);
    if (this.saveTimer !== undefined) {
      window.clearTimeout(this.saveTimer);
      this.saveTimer = undefined;
      this.pendingResolve?.();
      this.pendingResolve = undefined;
    }
    await this.save();
    for (const key of Object.keys(partial) as Array<keyof PluginSettings>) {
      for (const listener of this.listeners) {
        listener(key, this.settings[key]);
      }
    }
  }

  /** Get schema descriptor for a specific key. */
  getSchema<K extends keyof PluginSettings>(key: K): ConfigFieldDescriptor | undefined {
    return CONFIG_SCHEMA.find(s => s.key === key);
  }

  /** Get the full schema. */
  getSchemaAll(): ConfigFieldDescriptor[] {
    return [...CONFIG_SCHEMA];
  }

  /** Subscribe to config changes. Returns unsubscribe function. */
  onChange(listener: ConfigChangeListener): () => void {
    this.listeners.push(listener);
    return (): void => {
      const idx: number = this.listeners.indexOf(listener);
      if (idx >= 0) {
        this.listeners.splice(idx, 1);
      }
    };
  }

  /** Reset to default settings. */
  async reset(): Promise<void> {
    this.settings = { ...DEFAULT_SETTINGS };
    await this.save();
  }
}
