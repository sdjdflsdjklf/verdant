import type { PublishFile } from "../../types/publisher.types";

/**
 * Port interface for reading files from the Obsidian vault.
 *
 * Implemented by wrapping the Obsidian Vault API.
 */
export interface VaultRepositoryPort {
  /** Read a file's content as a string. */
  readFile(path: string): Promise<string>;

  /** Read a file's content as binary (ArrayBuffer). */
  readBinary(path: string): Promise<ArrayBuffer>;

  /** Check if a file exists at the given path. */
  exists(path: string): Promise<boolean>;

  /** List all markdown files in the vault (recursive). */
  listMarkdownFiles(): Promise<string[]>;

  /** Gather full PublishFile metadata for a single file. */
  getPublishFile(path: string): Promise<PublishFile>;
}
