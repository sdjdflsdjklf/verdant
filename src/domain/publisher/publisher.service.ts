import { injectable, inject } from "tsyringe";
import type {
  VaultRepositoryPort,
  KeyValueStorePort,
  LoggerPort,
  GitHubApiPort,
} from "../ports";
import type {
  PublishFile,
  PublishResult,
  PublishProgress,
  PublishStep,
  SiteConfig,
  GeneratedSite,
  FileDiff,
} from "../../types/publisher.types";
import type { PublishCache, CacheFileEntry } from "../../types/cache.types";
import type { GitFileEntry, GitPushResult, RepoInfo } from "../../types/github.types";
import { DI_TOKENS } from "../../di/tokens";
import { FREE_TIER_MAX_NOTES } from "../../constants/limits.constants";
import {
  COMMIT_MSG_UPDATE,
  COMMIT_MSG_REMOVE,
} from "../../constants/github.constants";
import { DEFAULT_PUBLISH_BRANCH } from "../../constants/plugin.constants";
import { ErrorCode } from "../../constants/errors.constants";
import { SiteGeneratorService, notePathToRepoPath } from "./site-generator.service";
import { DiffEngineService } from "./diff-engine.service";
import { ThemeRenderer } from "../../domain/theme/theme.renderer";
import { sha256 } from "../../shared/utils/crypto.utils";

function reportProgress(
  step: PublishStep,
  percent: number,
  message: string,
  onProgress?: (progress: PublishProgress) => void,
): void {
  if (onProgress !== undefined) {
    onProgress({ step, percent, message });
  }
}

function elapsedMs(start: number): number {
  return Date.now() - start;
}

@injectable()
export class PublisherService {
  constructor(
    @inject(DI_TOKENS.VaultRepository) private readonly vaultRepo: VaultRepositoryPort,
    @inject(DI_TOKENS.KeyValueStorePort) private readonly store: KeyValueStorePort,
    @inject(DI_TOKENS.LoggerService) private readonly logger: LoggerPort,
    @inject(DI_TOKENS.GitHubApiPort) private readonly githubApi: GitHubApiPort,
    @inject(DI_TOKENS.SiteGeneratorService) private readonly siteGenerator: SiteGeneratorService,
    @inject(DI_TOKENS.DiffEngineService) private readonly diffEngine: DiffEngineService,
    @inject(DI_TOKENS.ThemeRenderer) private readonly themeRenderer: ThemeRenderer,
  ) {}

  public async publish(
    notes: string[],
    config: SiteConfig,
    onProgress?: (progress: PublishProgress) => void,
    maxNotes: number = FREE_TIER_MAX_NOTES,
  ): Promise<PublishResult> {
    const startTime: number = Date.now();
    const branch: string = config.githubBranch ?? DEFAULT_PUBLISH_BRANCH;

    try {
      this.validateConfig(config);

      const currentFiles: PublishFile[] = await this.scanNotes(notes, maxNotes, onProgress);

      reportProgress("generating", 30, "Generating static site...", onProgress);
      const generatedSite: GeneratedSite = await this.siteGenerator.generateSite(
        currentFiles,
        config,
      );

      const gitFiles: GitFileEntry[] = this.buildGitFiles(generatedSite, config);

      reportProgress("pushing", 60, "Ensuring GitHub repository exists...", onProgress);
      const repoInfo: RepoInfo = await this.githubApi.ensureRepoExists(
        config.githubToken,
        config.githubOwner,
        config.githubRepo,
      );

      if (!repoInfo.exists) {
        throw new Error(
          `Repository "${config.githubOwner}/${config.githubRepo}" could not be created. ` +
          "Please check that your GitHub token has repo scope and try again.",
        );
      }

      reportProgress("pushing", 65, "Pushing to GitHub...", onProgress);
      const pushResult: GitPushResult = await this.githubApi.pushFiles(
        config.githubToken,
        config.githubOwner,
        config.githubRepo,
        branch,
        gitFiles,
        COMMIT_MSG_UPDATE,
      );

      if (!pushResult.success) {
        throw new Error(pushResult.error ?? "Git push failed");
      }

      reportProgress("deploying", 75, "Enabling GitHub Pages...", onProgress);
      await this.githubApi.enablePages(
        config.githubToken,
        config.githubOwner,
        config.githubRepo,
        branch,
      );

      reportProgress("deploying", 85, "Updating cache...", onProgress);
      await this.updateCache(currentFiles, config);

      reportProgress("done", 100, "Published successfully!", onProgress);

      return {
        success: true,
        siteUrl: config.baseUrl,
        notesPublished: currentFiles.length,
        elapsedMs: elapsedMs(startTime),
        wasIncremental: false,
      };
    } catch (error: unknown) {
      const message: string = error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Publish failed: %s", message);
      reportProgress("error", 0, message, onProgress);

      return {
        success: false,
        siteUrl: undefined,
        notesPublished: 0,
        elapsedMs: elapsedMs(startTime),
        error: message,
        wasIncremental: false,
      };
    }
  }

  public async publishIncremental(
    notes: string[],
    config: SiteConfig,
    onProgress?: (progress: PublishProgress) => void,
    maxNotes: number = FREE_TIER_MAX_NOTES,
  ): Promise<PublishResult> {
    const startTime: number = Date.now();
    const branch: string = config.githubBranch ?? DEFAULT_PUBLISH_BRANCH;

    try {
      this.validateConfig(config);

      const currentFiles: PublishFile[] = await this.scanNotes(notes, maxNotes, onProgress);

      reportProgress("generating", 30, "Computing diff...", onProgress);
      const diff: FileDiff = await this.diffEngine.computeDiff(currentFiles);

      if (diff.added.length === 0 && diff.modified.length === 0 && diff.deleted.length === 0) {
        this.logger.info("No changes detected, skipping publish");
        reportProgress("done", 100, "No changes to publish", onProgress);

        return {
          success: true,
          siteUrl: config.baseUrl,
          notesPublished: 0,
          elapsedMs: elapsedMs(startTime),
          wasIncremental: true,
        };
      }

      reportProgress("generating", 40, "Generating static site...", onProgress);
      const generatedSite: GeneratedSite = await this.siteGenerator.generateSite(
        currentFiles,
        config,
      );

      reportProgress("pushing", 60, "Ensuring GitHub repository exists...", onProgress);
      const repoInfo: RepoInfo = await this.githubApi.ensureRepoExists(
        config.githubToken,
        config.githubOwner,
        config.githubRepo,
      );

      if (!repoInfo.exists) {
        throw new Error(
          `Repository "${config.githubOwner}/${config.githubRepo}" could not be created. ` +
          "Please check that your GitHub token has repo scope and try again.",
        );
      }

      reportProgress("pushing", 65, "Pushing changes to GitHub...", onProgress);
      const gitFiles: GitFileEntry[] = this.buildGitFiles(generatedSite, config);

      const pushResult: GitPushResult = await this.githubApi.pushFiles(
        config.githubToken,
        config.githubOwner,
        config.githubRepo,
        branch,
        gitFiles,
        COMMIT_MSG_UPDATE,
      );

      if (!pushResult.success) {
        throw new Error(pushResult.error ?? "Git push failed");
      }

      if (diff.deleted.length > 0) {
        reportProgress("pushing", 70, "Removing deleted files...", onProgress);
        const deletedRepoPaths: string[] = diff.deleted.map(
          (p: string): string => notePathToRepoPath(p),
        );
        await this.githubApi.deleteFiles(
          config.githubToken,
          config.githubOwner,
          config.githubRepo,
          branch,
          deletedRepoPaths,
          COMMIT_MSG_REMOVE,
        );
      }

      reportProgress("deploying", 75, "Enabling GitHub Pages...", onProgress);
      await this.githubApi.enablePages(
        config.githubToken,
        config.githubOwner,
        config.githubRepo,
        branch,
      );

      reportProgress("deploying", 85, "Updating cache...", onProgress);
      await this.updateCache(currentFiles, config);

      reportProgress("done", 100, "Published incrementally!", onProgress);

      return {
        success: true,
        siteUrl: config.baseUrl,
        notesPublished: currentFiles.length,
        elapsedMs: elapsedMs(startTime),
        wasIncremental: true,
      };
    } catch (error: unknown) {
      const message: string = error instanceof Error ? error.message : "Unknown error";
      this.logger.error("Incremental publish failed: %s", message);
      reportProgress("error", 0, message, onProgress);

      return {
        success: false,
        siteUrl: undefined,
        notesPublished: 0,
        elapsedMs: elapsedMs(startTime),
        error: message,
        wasIncremental: true,
      };
    }
  }

  private async scanNotes(
    notes: string[],
    maxNotes: number = FREE_TIER_MAX_NOTES,
    onProgress?: (progress: PublishProgress) => void,
  ): Promise<PublishFile[]> {
    if (notes.length === 0) {
      throw new Error(ErrorCode.PUBLISH_NO_FILES);
    }

    if (maxNotes !== -1 && notes.length > maxNotes) {
      throw new Error(`Free tier limit exceeded: max ${maxNotes} notes`);
    }

    reportProgress("scanning", 10, "Scanning vault...", onProgress);

    const files: PublishFile[] = [];
    for (const notePath of notes) {
      const pf: PublishFile = await this.vaultRepo.getPublishFile(notePath);
      files.push(pf);
    }

    this.logger.info("Scanned %d notes from vault", files.length);
    return files;
  }

  private buildGitFiles(
    generatedSite: GeneratedSite,
    config: SiteConfig,
  ): GitFileEntry[] {
    const gitFiles: GitFileEntry[] = [];

    for (const gf of generatedSite.files) {
      gitFiles.push({
        path: gf.relativePath,
        content: gf.html,
        mode: "100644",
        type: "blob",
      });
    }

    gitFiles.push({
      path: "index.html",
      content: generatedSite.indexHtml,
      mode: "100644",
      type: "blob",
    });

    gitFiles.push({
      path: "navigation.json",
      content: JSON.stringify(generatedSite.navigation, null, 2),
      mode: "100644",
      type: "blob",
    });

    gitFiles.push({
      path: "search.json",
      content: JSON.stringify(generatedSite.searchIndex, null, 2),
      mode: "100644",
      type: "blob",
    });

    // Use ThemeRenderer to render tags page
    const tagsHtml: string = this.themeRenderer.renderTags(generatedSite.tags, config);

    gitFiles.push({
      path: "tags/index.html",
      content: tagsHtml,
      mode: "100644",
      type: "blob",
    });

    gitFiles.push({
      path: ".nojekyll",
      content: "",
      mode: "100644",
      type: "blob",
    });

    if (generatedSite.feedXml) {
      gitFiles.push({
        path: "feed.xml",
        content: generatedSite.feedXml,
        mode: "100644",
        type: "blob",
      });
    }

    const themeCss: string = config.customCss ?? this.themeRenderer.getCSS(config.themeId ?? "default");
    gitFiles.push({
      path: "assets/theme.css",
      content: themeCss,
      mode: "100644",
      type: "blob",
    });

    if (config.isPro) {
      const flexsearchBundle: string = this.themeRenderer.getFlexSearchBundle();
      if (flexsearchBundle) {
        gitFiles.push({
          path: "assets/flexsearch.bundle.js",
          content: flexsearchBundle,
          mode: "100644",
          type: "blob",
        });
      }
    }

    return gitFiles;
  }

  private validateConfig(config: SiteConfig): void {
    const missing: string[] = [];
    if (config.githubToken === "") missing.push("GitHub token");
    if (config.githubOwner === "") missing.push("GitHub username");
    if (config.githubRepo === "") missing.push("Repository name");
    if (config.title === "") missing.push("Site title");
    if (missing.length > 0) {
      throw new Error(
        `Missing required configuration: ${missing.join(", ")}. ` +
        "Please fill in these fields in the settings panel.",
      );
    }

    if (!config.baseUrl || config.baseUrl === "") {
      this.logger.warn("baseUrl is empty — site links may not resolve correctly");
    }
  }

  private async updateCache(files: PublishFile[], config: SiteConfig): Promise<void> {
    const fileEntries: Record<string, CacheFileEntry> = {};

    for (const file of files) {
      const hash: string = await sha256(file.content);
      fileEntries[file.relativePath] = {
        hash,
        size: new TextEncoder().encode(file.content).length,
        lastModified: file.mtime,
      };
    }

    const cache: PublishCache = {
      version: 1,
      lastPublished: new Date().toISOString(),
      files: fileEntries,
      siteConfig: {
        repo: config.githubRepo,
        branch: config.githubBranch ?? DEFAULT_PUBLISH_BRANCH,
      },
    };

    this.store.set("main", cache);
    this.logger.info("Cache updated with %d files", files.length);
  }
}
