import { PluginSettingTab, Setting, type App, type Plugin, Notice } from "obsidian";
import type { PluginSettings } from "../../types/plugin.types";
import { container } from "../../di/container";
import { DI_TOKENS } from "../../di/tokens";
import type { GithubAuthService } from "../../domain/github/github-auth.service";
import type { ThemeDefinition } from "../../types/theme.types";
import type { AuthResult } from "../../types/github.types";
import type { PluginConfigService } from "../../config/plugin-config.service";

export class SettingsPanelView extends PluginSettingTab {
  private readonly configService: PluginConfigService;

  constructor(app: App, plugin: Plugin) {
    super(app, plugin);
    this.configService = container.resolve<PluginConfigService>(DI_TOKENS.PluginConfigService);
  }

  public display(): void {
    const { containerEl } = this;
    containerEl.empty();

    this.addGitHubSection(containerEl);
    this.addSiteSection(containerEl);
    this.addUpgradeSection(containerEl);
  }

  private addGitHubSection(container: HTMLElement): void {
    new Setting(container).setName("GitHub").setHeading();

    const settings: PluginSettings = this.configService.getAll();

    new Setting(container)
      .setName("Personal Access Token")
      .setDesc("repo scope required")
      .addText((text): void => {
        text
          .setPlaceholder("ghp_...")
          .setValue(settings.githubToken)
          .onChange(async (val: string): Promise<void> => {
            await this.configService.set("githubToken", val);
          });
      })
      .addButton((btn): void => {
        btn.setButtonText("Verify").onClick(async (): Promise<void> => {
          await this.verifyToken();
        });
      });

    new Setting(container)
      .setName("GitHub Username")
      .setDesc("Your GitHub username")
      .addText((text): void => {
        text
          .setPlaceholder("username")
          .setValue(settings.githubUsername)
          .onChange(async (val: string): Promise<void> => {
            await this.configService.set("githubUsername", val);
          });
      });

    new Setting(container)
      .setName("Repository Name")
      .setDesc("Where the site gets deployed")
      .addText((text): void => {
        text
          .setPlaceholder("my-verdant-site")
          .setValue(settings.repoName)
          .onChange(async (val: string): Promise<void> => {
            await this.configService.set("repoName", val);
          });
      });

    new Setting(container)
      .setName("Publish Branch")
      .setDesc("Default: gh-pages")
      .addText((text): void => {
        text
          .setPlaceholder("gh-pages")
          .setValue(settings.publishBranch)
          .onChange(async (val: string): Promise<void> => {
            await this.configService.set("publishBranch", val);
          });
      });
  }

  private addUpgradeSection(container: HTMLElement): void {
    new Setting(container).setName("Upgrade to Pro").setHeading();

    container.createEl("p", {
      text: "Unlock unlimited notes and more features. Purchase on Payhip, then paste the license key in the Pro version to activate.",
    });

    const buttonsContainer: HTMLDivElement = container.createDiv({ cls: "verdant-purchase-buttons" });

    const payhipLink: HTMLAnchorElement = buttonsContainer.createEl("a", {
      cls: "verdant-purchase-btn verdant-purchase-btn--payhip",
      href: "https://payhip.com/b/RnYOS",
      text: "Payhip — $19",
    });
    payhipLink.target = "_blank";
  }

  private addSiteSection(container: HTMLElement): void {
    new Setting(container).setName("Site").setHeading();

    const settings: PluginSettings = this.configService.getAll();

    new Setting(container)
      .setName("Site Title")
      .setDesc("Shown on the published site")
      .addText((text): void => {
        text
          .setPlaceholder("My Notes")
          .setValue(settings.siteTitle)
          .onChange(async (val: string): Promise<void> => {
            await this.configService.set("siteTitle", val);
          });
      });

    new Setting(container)
      .setName("Site Description")
      .setDesc("Short description for the site header")
      .addTextArea((text): void => {
        text
          .setPlaceholder("Personal notes and writing")
          .setValue(settings.siteDescription)
          .onChange(async (val: string): Promise<void> => {
            await this.configService.set("siteDescription", val);
          });
      });

    new Setting(container)
      .setName("Theme")
      .setDesc("Site appearance")
      .addDropdown((dropdown): void => {
        const themes: ThemeDefinition[] = this.getAvailableThemes();
        for (const theme of themes) {
          dropdown.addOption(theme.id, theme.name);
        }
        dropdown.setValue(settings.themeId);
        dropdown.onChange(async (val: string): Promise<void> => {
          await this.configService.set("themeId", val);
        });
      });
  }

  private async verifyToken(): Promise<void> {
    const authService = container.resolve<GithubAuthService>(DI_TOKENS.GitHubAuthService);
    const token: string = this.configService.get("githubToken");

    if (token === "") {
      new Notice("Enter a token first");
      return;
    }

    const result: AuthResult = await authService.validateToken(token);

    if (result.valid) {
      new Notice(`Token valid (${result.username ?? "unknown"})`);
      if (result.username !== undefined && result.username !== "") {
        await this.configService.set("githubUsername", result.username);
        this.display();
      }
    } else {
      new Notice(`${result.error ?? "Invalid token"}`);
    }
  }

  private getAvailableThemes(): ThemeDefinition[] {
    try {
      const registry = container.resolve<{ list: () => ThemeDefinition[] }>(DI_TOKENS.ThemeRegistry);
      return registry.list();
    } catch {
      return [];
    }
  }
}