import { Modal, type App, type Plugin, Notice, setIcon } from "obsidian";
import { container } from "../../di/container";
import { DI_TOKENS } from "../../di/tokens";
import type { PublisherService } from "../../domain/publisher/publisher.service";
import type { PublishProgress, PublishResult, SiteConfig } from "../../types/publisher.types";
import type { PluginSettings } from "../../types/plugin.types";
import type { PluginConfigService } from "../../config/plugin-config.service";
import type { LoggerPort } from "../../domain/ports";
import { ErrorBoundary } from "../../bootstrap/error-boundary";

export class PublishModalView extends Modal {
  private progressBar!: HTMLProgressElement;
  private stepText!: HTMLElement;
  private publishBtn!: HTMLElement;
  private progressSection!: HTMLElement;
  private resultSection!: HTMLElement;
  private fileSummary!: HTMLElement;
  private isPublishing: boolean = false;
  private isClosed: boolean = false;

  constructor(app: App, _plugin: Plugin) {
    super(app);
  }

  public onClose(): void {
    this.isClosed = true;
  }

  public onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl("h2", { text: "Publish to GitHub Pages" });

    this.fileSummary = contentEl.createDiv({ cls: "setting-item-info" });
    this.updateFileSummary();

    this.publishBtn = contentEl.createEl("button", {
      text: "Publish",
      cls: "mod-cta",
    });
    this.publishBtn.addEventListener("click", async (): Promise<void> => {
      await this.doPublish();
    });

    this.progressSection = contentEl.createDiv({ cls: "publish-progress" });
    this.progressSection.style.display = "none";

    this.progressBar = this.progressSection.createEl("progress", {
      cls: "publish-progress-bar",
    });
    this.progressBar.max = 100;
    this.progressBar.value = 0;

    this.stepText = this.progressSection.createDiv({
      cls: "setting-item-description",
    });

    this.resultSection = contentEl.createDiv({ cls: "publish-result" });
    this.resultSection.style.display = "none";
  }

  private updateFileSummary(): void {
    const configService = container.resolve<PluginConfigService>(DI_TOKENS.PluginConfigService);
    const settings: PluginSettings = configService.getAll();
    const count: number = settings.selectedNotes.length;
    this.fileSummary.setText(`● ${count} file${count !== 1 ? "s" : ""} selected`);
  }

  private async doPublish(): Promise<void> {
    if (this.isPublishing) return;
    this.isPublishing = true;

    const configService = container.resolve<PluginConfigService>(DI_TOKENS.PluginConfigService);
    const settings: PluginSettings = configService.getAll();
    const selectedNotes: string[] = settings.selectedNotes;

    if (selectedNotes.length === 0) {
      new Notice("No files selected. Select files in the Note Selector first.");
      this.isPublishing = false;
      return;
    }

    this.publishBtn.setAttr("disabled", true);
    this.publishBtn.setText("Publishing...");
    this.showProgress();

    const publisher = container.resolve<PublisherService>(
      DI_TOKENS.PublisherService,
    );
    const logger = container.resolve<LoggerPort>(DI_TOKENS.LoggerService);

    const siteConfig: SiteConfig = {
      title: settings.siteTitle,
      description: settings.siteDescription,
      baseUrl: `https://${settings.githubUsername}.github.io/${settings.repoName}`,
      themeId: settings.themeId,
      githubToken: settings.githubToken,
      githubOwner: settings.githubUsername,
      githubRepo: settings.repoName,
      githubBranch: settings.publishBranch,
      isPro: false,
    };

    const result: PublishResult = await ErrorBoundary.wrap(
      async (): Promise<PublishResult> =>
        publisher.publish(
          selectedNotes,
          siteConfig,
          (progress: PublishProgress): void => {
            if (!this.isClosed) {
              this.updateProgress(progress);
            }
          },
          10,
        ),
      "PublishModal.doPublish",
      logger,
    );

    this.isPublishing = false;
    if (this.isClosed) return;
    this.publishBtn.removeAttribute("disabled");

    if (result.success) {
      this.showSuccess(result);
    } else {
      this.showError(result);
    }
  }

  private showProgress(): void {
    this.progressSection.style.display = "";
    this.resultSection.style.display = "none";
    this.progressBar.value = 0;
    this.stepText.setText("Starting...");
  }

  private updateProgress(progress: PublishProgress): void {
    this.progressBar.value = progress.percent;
    this.stepText.setText(progress.message);
  }

  private showSuccess(result: PublishResult): void {
    this.progressSection.style.display = "none";
    this.resultSection.style.display = "";
    this.resultSection.empty();

    const successEl = this.resultSection.createDiv({
      cls: "setting-item-info",
    });
    successEl.setText(`Published! ${result.notesPublished} notes deployed.`);

    if (result.siteUrl !== undefined) {
      const urlEl = this.resultSection.createDiv({
        cls: "setting-item-description",
      });
      urlEl.setText(result.siteUrl);

      const viewBtn = this.resultSection.createEl("button", {
        text: "View Site",
        cls: "mod-cta",
      });
      viewBtn.addEventListener("click", (): void => {
        if (result.siteUrl !== undefined) {
          open(result.siteUrl);
        }
      });
    }

    const closeBtn = this.resultSection.createEl("button", {
      cls: "publish-modal-close-btn",
    });
    setIcon(closeBtn, "x");
    closeBtn.addEventListener("click", (): void => {
      this.close();
    });
  }

  private showError(result: PublishResult): void {
    this.progressSection.style.display = "none";
    this.resultSection.style.display = "";
    this.resultSection.empty();

    const errorEl = this.resultSection.createDiv({
      cls: "setting-item-error",
    });
    errorEl.setText(result.error ?? "Publish failed");

    const retryBtn = this.resultSection.createEl("button", {
      text: "Retry",
      cls: "mod-cta",
    });
    retryBtn.addEventListener("click", async (): Promise<void> => {
      this.resultSection.style.display = "none";
      await this.doPublish();
    });
  }
}
