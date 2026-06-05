import { Plugin, Notice } from "obsidian";
import "reflect-metadata";
import { registerInfrastructure } from "./di/registrations";
import { container } from "./di/container";
import { DI_TOKENS } from "./di/tokens";
import { PluginDataStore } from "./infrastructure/storage/plugin-data.store";
import { PluginInitializer } from "./bootstrap/plugin-initializer";
import type { PluginSettings } from "./types/plugin.types";
import { DEFAULT_SETTINGS } from "./types/plugin.types";
import type { PluginConfigService } from "./config/plugin-config.service";
import { ViewController } from "./presentation/view-controller";
import { StatusBarView } from "./presentation/components/status-bar.view";
import { SettingsPanelView } from "./presentation/components/settings-panel.view";

export default class ObsidianGardenPlugin extends Plugin {
  public settings: PluginSettings = DEFAULT_SETTINGS;
  private initializer!: PluginInitializer;
  private viewController!: ViewController;
  private statusBar!: StatusBarView;

  public async onload(): Promise<void> {
    registerInfrastructure();

    // Initialize persistent key-value store
    const pluginStore: PluginDataStore = container.resolve<PluginDataStore>(DI_TOKENS.PluginDataStore);
    PluginDataStore.setPlugin(this);
    await pluginStore.init();

    // Register Obsidian runtime objects for infrastructure services
    container.register(DI_TOKENS.ObsidianApp, { useValue: this.app });

    // Create settings store and initialize config service through it
    const settingsStore: PluginDataStore = PluginDataStore.create("settings");
    const configService: PluginConfigService = container.resolve<PluginConfigService>(DI_TOKENS.PluginConfigService);
    configService.init(settingsStore);
    this.settings = await configService.load();

    this.initializer = container.resolve(PluginInitializer);
    await this.initializer.initialize(this, this.settings);

    this.viewController = container.resolve(ViewController);
    this.viewController.registerViews(this);

    this.statusBar = new StatusBarView(this, (): void => {
      this.activateView();
    });

    this.addRibbonIcon("globe", "Garden", async (): Promise<void> => {
      await this.viewController.activateNoteSelector(this);
    });

    this.addCommand({
      id: "open-publish-modal",
      name: "Open publish modal",
      callback: (): void => {
        this.viewController.openPublishModal(this);
      },
    });

    this.addCommand({
      id: "open-note-selector",
      name: "Open note selector",
      callback: async (): Promise<void> => {
        await this.viewController.activateNoteSelector(this);
      },
    });

    this.addSettingTab(new SettingsPanelView(this.app, this));

    new Notice("Garden loaded");
  }

  public onunload(): void {
    this.statusBar?.destroy();
  }

  public async loadSettings(): Promise<void> {
    const configService: PluginConfigService = container.resolve<PluginConfigService>(DI_TOKENS.PluginConfigService);
    this.settings = await configService.load();
  }

  public async saveSettings(): Promise<void> {
    const configService: PluginConfigService = container.resolve<PluginConfigService>(DI_TOKENS.PluginConfigService);
    await configService.update(this.settings);
  }

  private activateView(): void {
    void this.viewController.activateNoteSelector(this);
  }
}
