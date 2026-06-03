import type { PublishCache } from "../../types/cache.types";

/**
 * Port interface for the publish cache repository.
 *
 * The cache stores file hashes, timestamps, and site metadata as JSON,
 * enabling incremental publish (diff only changed files).
 *
 * @deprecated Use {@link KeyValueStorePort} with namespace "publish_cache" instead.
 */
export interface CachePort {
  /** Read the full cache blob. Returns null if no cache exists. */
  read(): Promise<PublishCache | null>;

  /** Write (overwrite) the full cache blob. */
  write(cache: PublishCache): Promise<void>;

  /** Delete the cache entirely. */
  clear(): Promise<void>;
}
