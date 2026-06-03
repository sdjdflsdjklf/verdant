import { injectable, inject } from "tsyringe";
import type { App, TFile } from "obsidian";
import type { VaultRepositoryPort } from "../../domain/ports/vault-repository.port";
import type { PublishFile } from "../../types/publisher.types";
import { DI_TOKENS } from "../../di/tokens";
import { sha256 } from "../../shared/utils/crypto.utils";

/**
 * Real implementation of {@link VaultRepositoryPort}.
 *
 * Wraps Obsidian's `Vault` API to read files, check existence,
 * list markdown files, and gather {@link PublishFile} metadata.
 */
@injectable()
export class VaultRepository implements VaultRepositoryPort {
  constructor(
    @inject(DI_TOKENS.ObsidianApp) private readonly app: App,
  ) {}

  public async readFile(path: string): Promise<string> {
    const file: TFile | null = this.app.vault.getFileByPath(path);
    if (file === null) {
      throw new Error(`File not found: ${path}`);
    }
    return await this.app.vault.read(file);
  }

  public async readBinary(path: string): Promise<ArrayBuffer> {
    const file: TFile | null = this.app.vault.getFileByPath(path);
    if (file === null) {
      throw new Error(`File not found: ${path}`);
    }
    return await this.app.vault.readBinary(file);
  }

  public async exists(path: string): Promise<boolean> {
    return this.app.vault.getFileByPath(path) !== null;
  }

  public async listMarkdownFiles(): Promise<string[]> {
    return this.app.vault.getMarkdownFiles().map((f: TFile): string => f.path);
  }

  public async getPublishFile(path: string): Promise<PublishFile> {
    const file: TFile | null = this.app.vault.getFileByPath(path);
    if (file === null) {
      throw new Error(`File not found: ${path}`);
    }
    const content: string = await this.app.vault.read(file);
    const hash: string = await sha256(content);
    // Note: Obsidian Vault paths are always vault-relative, not filesystem-absolute.
    // relativePath = the path parameter (may be a link path like "notes/page"),
    // absolutePath = TFile.path (canonical vault path like "folder/notes/page.md")
    return {
      relativePath: path,
      absolutePath: file.path,
      content,
      hash,
      mtime: file.stat.mtime,
    };
  }
}
