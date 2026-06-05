import { injectable } from "tsyringe";
import type { KeyValueStorePort } from "../../domain/ports/key-value-store.port";

/**
 * In-memory key-value store repository.
 *
 * For the MVP the store lives in memory within the plugin session.
 * A file‑based implementation will be added in a later iteration.
 */
@injectable()
export class CacheRepository implements KeyValueStorePort {
  private readonly store = new Map<string, unknown>();

  public get<T>(key: string): T | undefined {
    return this.store.get(key) as T | undefined;
  }

  public set<T>(key: string, value: T): void {
    this.store.set(key, value);
  }

  public delete(key: string): boolean {
    return this.store.delete(key);
  }

  public has(key: string): boolean {
    return this.store.has(key);
  }

  public clear(): void {
    this.store.clear();
  }

  public getAll<T>(): Record<string, T> {
    const result: Record<string, T> = {};
    for (const [key, value] of this.store.entries()) {
      result[key] = value as T;
    }
    return result;
  }
}
