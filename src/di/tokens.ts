import type { InjectionToken } from "tsyringe";

/**
 * Central registry of DI tokens for the entire application.
 * One token per service/repository to enable clean constructor injection.
 */
export const DI_TOKENS = {
  // Infrastructure
  LoggerService: Symbol.for("LoggerService") as InjectionToken,
  CacheRepository: Symbol.for("CacheRepository") as InjectionToken,
  StorageRepository: Symbol.for("StorageRepository") as InjectionToken,
  KeyValueStorePort: Symbol.for("KeyValueStorePort") as InjectionToken,
  PluginDataStore: Symbol.for("PluginDataStore") as InjectionToken,
  HttpClient: Symbol.for("HttpClient") as InjectionToken,
  VaultRepository: Symbol.for("VaultRepository") as InjectionToken,
  MarkdownRenderer: Symbol.for("MarkdownRenderer") as InjectionToken,
  SettingsRenderer: Symbol.for("SettingsRenderer") as InjectionToken,
  PluginConfigService: Symbol.for("PluginConfigService") as InjectionToken,

  // Domain — GitHub
  GitHubApiPort: Symbol.for("GitHubApiPort") as InjectionToken,
  GitHubAuthService: Symbol.for("GitHubAuthService") as InjectionToken,
  GitHubRepoService: Symbol.for("GitHubRepoService") as InjectionToken,
  GitHubPagesService: Symbol.for("GitHubPagesService") as InjectionToken,

  // Domain — Publisher
  PublisherService: Symbol.for("PublisherService") as InjectionToken,
  SiteGeneratorService: Symbol.for("SiteGeneratorService") as InjectionToken,
  DiffEngineService: Symbol.for("DiffEngineService") as InjectionToken,
  LinkGraphService: Symbol.for("LinkGraphService") as InjectionToken,

  // Domain — Theme
  ThemeRegistry: Symbol.for("ThemeRegistry") as InjectionToken,
  ThemeRenderer: Symbol.for("ThemeRenderer") as InjectionToken,
  ThemeService: Symbol.for("ThemeService") as InjectionToken,

  // Application
  PluginInitializer: Symbol.for("PluginInitializer") as InjectionToken,
  ErrorBoundary: Symbol.for("ErrorBoundary") as InjectionToken,
  ObsidianApp: Symbol.for("ObsidianApp") as InjectionToken,

  // Presentation
  NoteSelectorView: Symbol.for("NoteSelectorView") as InjectionToken,
  PublishModalView: Symbol.for("PublishModalView") as InjectionToken,
  SettingsPanelView: Symbol.for("SettingsPanelView") as InjectionToken,
  StatusBarView: Symbol.for("StatusBarView") as InjectionToken,
  ViewController: Symbol.for("ViewController") as InjectionToken,
} as const;
