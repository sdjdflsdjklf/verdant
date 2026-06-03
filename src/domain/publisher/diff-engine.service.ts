import { injectable, inject } from "tsyringe";
import type { LoggerPort, KeyValueStorePort } from "../ports";
import type { PublishFile, FileDiff } from "../../types/publisher.types";
import type { PublishCache, CacheFileEntry } from "../../types/cache.types";
import { DI_TOKENS } from "../../di/tokens";
import { sha256 } from "../../shared/utils/crypto.utils";

export function filesMetadataMatch(a: CacheFileEntry, b: PublishFile): boolean {
  return a.lastModified === b.mtime;
}

@injectable()
export class DiffEngineService {
  constructor(
    @inject(DI_TOKENS.LoggerService) private readonly logger: LoggerPort,
    @inject(DI_TOKENS.KeyValueStorePort) private readonly store: KeyValueStorePort,
  ) {}

  public async computeDiff(currentFiles: PublishFile[]): Promise<FileDiff> {
    const cache: PublishCache | undefined = this.store.get<PublishCache>("main");

    this.logger.info(
      "Computing diff: %d current files vs cache with %d entries",
      currentFiles.length,
      cache !== undefined && cache !== null ? Object.keys(cache.files).length : 0,
    );

    const added: PublishFile[] = [];
    const modified: PublishFile[] = [];
    const deleted: string[] = [];
    const unchanged: string[] = [];

    const currentMap: Map<string, PublishFile> = new Map();
    for (const file of currentFiles) {
      currentMap.set(file.relativePath, file);
    }

    if (cache === undefined || cache === null) {
      for (const file of currentFiles) {
        added.push(file);
      }

      this.logger.info(
        "Diff result (no cache): %d added, %d modified, %d deleted, %d unchanged",
        added.length,
        modified.length,
        deleted.length,
        unchanged.length,
      );

      return { added, modified, deleted, unchanged };
    }

    for (const file of currentFiles) {
      const cachedEntry = cache.files[file.relativePath];

      if (cachedEntry === undefined) {
        added.push(file);
        continue;
      }

      if (filesMetadataMatch(cachedEntry, file)) {
        unchanged.push(file.relativePath);
        continue;
      }

      const currentHash: string = await sha256(file.content);

      if (currentHash === cachedEntry.hash) {
        unchanged.push(file.relativePath);
      } else {
        modified.push(file);
      }
    }

    for (const cachedPath of Object.keys(cache.files)) {
      if (!currentMap.has(cachedPath)) {
        deleted.push(cachedPath);
      }
    }

    this.logger.info(
      "Diff result: %d added, %d modified, %d deleted, %d unchanged",
      added.length,
      modified.length,
      deleted.length,
      unchanged.length,
    );

    return { added, modified, deleted, unchanged };
  }
}
