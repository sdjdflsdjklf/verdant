import { injectable, singleton, inject } from "tsyringe";
import { container } from "../di/container";
import { DI_TOKENS } from "../di/tokens";
import { HttpClient } from "../infrastructure/http/http.client";
import { obsidianHttpInterceptor } from "./obsidian-http.interceptor";
import { PluginDataStore } from "../infrastructure/storage/plugin-data.store";

import type { LoggerPort } from "../domain/ports";
import type { PluginSettings } from "../types/plugin.types";

import { GithubAuthService } from "../domain/github/github-auth.service";
import { GithubRepoService } from "../domain/github/github-repo.service";
import { GithubPagesService } from "../domain/github/github-pages.service";
import { GithubApiAdapter } from "./github-api.adapter";
import { SiteGeneratorService } from "../domain/publisher/site-generator.service";
import { DiffEngineService } from "../domain/publisher/diff-engine.service";
import { PublisherService } from "../domain/publisher/publisher.service";
import { LinkGraphService } from "../domain/publisher/link-graph.service";
import { ThemeRegistry } from "../domain/theme/theme.registry";
import { ThemeRenderer } from "../domain/theme/theme.renderer";
import { ThemeService } from "../domain/theme/theme.service";

export interface PluginHost {
  readonly settings: PluginSettings;
  loadSettings(): Promise<void>;
  saveSettings(): Promise<void>;
}

@singleton()
@injectable()
export class PluginInitializer {
  constructor(
    @inject(DI_TOKENS.LoggerService) private readonly logger: LoggerPort,
  ) {}

  async initialize(_plugin: PluginHost, _settings: PluginSettings): Promise<void> {
    try {
      this.logger.info("Initializing Garden...");

      this.registerPersistence();

      this.registerAll();

      this.initThemeRegistry();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error("Plugin initialization failed: {message}", message);
      throw error;
    }
  }

  dispose(): void {
    this.logger.info("Disposing Garden services...");
    container.clearInstances();
  }

  private registerPersistence(): void {
    const publishStore: PluginDataStore = PluginDataStore.create("publish_cache");
    container.register(DI_TOKENS.KeyValueStorePort, { useValue: publishStore });
    this.logger.info("KeyValueStore (publish_cache) registered");
  }

  private registerAll(): void {
    const httpClient = container.resolve<HttpClient>(DI_TOKENS.HttpClient);
    httpClient.addInterceptor(obsidianHttpInterceptor);

    container.registerSingleton(DI_TOKENS.GitHubAuthService, GithubAuthService);
    container.registerSingleton(DI_TOKENS.GitHubRepoService, GithubRepoService);
    container.registerSingleton(DI_TOKENS.GitHubPagesService, GithubPagesService);
    container.registerSingleton(DI_TOKENS.GitHubApiPort, GithubApiAdapter);

    container.registerSingleton(DI_TOKENS.SiteGeneratorService, SiteGeneratorService);
    container.registerSingleton(DI_TOKENS.DiffEngineService, DiffEngineService);
    container.registerSingleton(DI_TOKENS.PublisherService, PublisherService);
    container.registerSingleton(DI_TOKENS.LinkGraphService, LinkGraphService);

    container.registerSingleton(DI_TOKENS.ThemeRegistry, ThemeRegistry);
    container.registerSingleton(DI_TOKENS.ThemeRenderer, ThemeRenderer);
    container.registerSingleton(DI_TOKENS.ThemeService, ThemeService);

    this.logger.info("All services registered in DI container");
  }

  private initThemeRegistry(): void {
    const themeRegistry = container.resolve(ThemeRegistry);
    const themes = themeRegistry.list();
    this.logger.info("Theme registry initialized with {count} themes", themes.length);
  }
}
