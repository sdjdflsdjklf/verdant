/**
 * Port interface for key-value storage.
 *
 * Implemented by wrapping Obsidian's PluginData (`loadData` / `saveData`),
 * enabling persistence of the plugin settings and local state.
 *
 * @deprecated Use {@link KeyValueStorePort} instead.
 */
export interface StoragePort {
  /** Load a value by key. Returns null when no data exists. */
  get<T>(key: string): Promise<T | null>;

  /** Store a value by key. */
  set<T>(key: string, value: T): Promise<void>;

  /** Remove a key from storage. */
  delete(key: string): Promise<void>;
}
