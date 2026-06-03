import { injectable } from "tsyringe";
import type { PublishCache } from "../../types/cache.types";
import type { CachePort } from "../../domain/ports/cache.port";

/**
 * In-memory cache repository.
 *
 * For the MVP the cache lives in memory within the plugin session.
 * A file‑based implementation will be added in a later iteration.
 */
@injectable()
export class CacheRepository implements CachePort {
  private cache: PublishCache | null = null;

  public async read(): Promise<PublishCache | null> {
    return this.cache;
  }

  public async write(cache: PublishCache): Promise<void> {
    this.cache = cache;
  }

  public async clear(): Promise<void> {
    this.cache = null;
  }
}
