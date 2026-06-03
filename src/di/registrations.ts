import { container } from "./container";
import { DI_TOKENS } from "./tokens";

import { LoggerService } from "../infrastructure/logging/logger.service";
import { CacheRepository } from "../infrastructure/cache/cache.repository";
import { StorageRepository } from "../infrastructure/storage/storage.repository";
import { PluginDataStore } from "../infrastructure/storage/plugin-data.store";
import { HttpClient } from "../infrastructure/http/http.client";
import { VaultRepository } from "../infrastructure/obsidian/vault.repository";
import { MarkdownRenderer } from "../infrastructure/obsidian/markdown.renderer";
import { SettingsRenderer } from "../infrastructure/obsidian/settings-renderer";
import { PluginConfigService } from "../config/plugin-config.service";

/**
 * Register all infrastructure-layer services with the DI container.
 *
 * Called once at plugin bootstrap (Phase 7) after `reflect-metadata` is loaded.
 */
export function registerInfrastructure(): void {
  container.registerSingleton(DI_TOKENS.LoggerService, LoggerService);
  container.registerSingleton(DI_TOKENS.CacheRepository, CacheRepository);
  container.registerSingleton(DI_TOKENS.StorageRepository, StorageRepository);
  container.registerSingleton(DI_TOKENS.PluginDataStore, PluginDataStore);
  container.registerSingleton(DI_TOKENS.HttpClient, HttpClient);
  container.registerSingleton(DI_TOKENS.VaultRepository, VaultRepository);
  container.registerSingleton(DI_TOKENS.MarkdownRenderer, MarkdownRenderer);
  container.registerSingleton(DI_TOKENS.SettingsRenderer, SettingsRenderer);
  container.registerSingleton(DI_TOKENS.PluginConfigService, PluginConfigService);
}
