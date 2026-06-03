import { injectable } from "tsyringe";
import type { StoragePort } from "../../domain/ports/storage.port";

/**
 * In-memory storage repository.
 *
 * For the MVP the storage lives in memory within the plugin session.
 * Obsidian's `Plugin.loadData()` / `saveData()` bridge will be added
 * when the plugin initializer is built (Phase 7).
 */
@injectable()
export class StorageRepository implements StoragePort {
  private readonly store = new Map<string, string>();

  public async get<T>(key: string): Promise<T | null> {
    const raw = this.store.get(key);
    if (raw === undefined) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  public async set<T>(key: string, value: T): Promise<void> {
    this.store.set(key, JSON.stringify(value));
  }

  public async delete(key: string): Promise<void> {
    this.store.delete(key);
  }
}
