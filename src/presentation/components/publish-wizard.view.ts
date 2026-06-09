import { Modal, Notice } from "obsidian";
import { container } from "../../di/container";
import { DI_TOKENS } from "../../di/tokens";
import type { PublisherService } from "../../domain/publisher/publisher.service";
import type { SiteGeneratorService } from "../../domain/publisher/site-generator.service";
import type {
  PublishProgress,
  PublishResult,
  PublishFile,
  SiteConfig,
  GeneratedSite,
  NavItem,
} from "../../types/publisher.types";
import type { PluginSettings } from "../../types/plugin.types";

import type { LoggerPort } from "../../domain/ports/logger.port";
import type { ThemeService } from "../../domain/theme/theme.service";
import type { PluginConfigService } from "../../config/plugin-config.service";
import type { VaultRepositoryPort } from "../../domain/ports/vault-repository.port";
import { ErrorBoundary } from "../../bootstrap/error-boundary";

type WizardStep = "info" | "preview" | "publish";

/** Use activeDocument for popout window compatibility. */
function getDoc(): Document {
  return activeDocument;
}

export class PublishWizardView extends Modal {
  private currentStep: WizardStep = "info";

  private titleInput!: HTMLInputElement;
  private descInput!: HTMLTextAreaElement;
  private repoInput: HTMLInputElement | null = null;
  private branchInput: HTMLInputElement | null = null;

  private previewFrame!: HTMLIFrameElement;
  private previewThemeSelect!: HTMLSelectElement;
  private previewLayout: HTMLElement | null = null;

  private progressBar!: HTMLProgressElement;
  private stepText!: HTMLElement;
  private resultSection!: HTMLElement;

  private stepIndicator!: HTMLElement;
  private contentArea!: HTMLElement;
  private navButtons!: HTMLElement;
  private resizeObserver: ResizeObserver | null = null;

  private isPublishing: boolean = false;
  private isTransitioning: boolean = false;

  public onOpen(): void {
    const { contentEl, modalEl, titleEl, containerEl } = this;

    if (titleEl !== undefined) {
      titleEl.addClass("wizard-modal-title-hidden");
    }

    modalEl.addClass("wizard-modal-flex");
    contentEl.addClass("wizard-content-flex");
    containerEl.setCssProps({ width: "", maxWidth: "" });

    contentEl.empty();
    contentEl.addClass("obsidian-garden-publish-wizard");

    this.injectStyles();

    this.stepIndicator = contentEl.createDiv({ cls: "wizard-step-indicator" });
    this.contentArea = contentEl.createDiv({ cls: "wizard-content visible" });
    this.navButtons = contentEl.createDiv({ cls: "wizard-nav-buttons" });

    this.resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]): void => {
      for (const entry of entries) {
        this.reflowLayout(entry.contentRect.height);
      }
    });
    this.resizeObserver.observe(contentEl);

    this.renderStepIndicator();
    void this.showStep("info");

    const bg: HTMLElement | null = this.modalEl.parentElement?.querySelector(".modal-bg") ?? null;
    if (bg !== null) {
      bg.addClass("wizard-bg-no-pointer");
    }
  }

  public onClose(): void {
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    super.onClose();
  }

  private renderStepIndicator(): void {
    this.stepIndicator.empty();

    const steps: Array<{ id: WizardStep; label: string; num: string }> = [
      { id: "info", label: "Customize", num: "1" },
      { id: "preview", label: "Preview", num: "2" },
      { id: "publish", label: "Publish", num: "3" },
    ];

    const currentOrder: number = stepOrder(this.currentStep);

    for (let idx: number = 0; idx < steps.length; idx++) {
      const step = steps[idx];
      if (step === undefined) continue;

      if (idx > 0) {
        const connector: HTMLElement = this.stepIndicator.createDiv({ cls: "wizard-step-connector" });
        if (stepOrder(step.id) <= currentOrder) {
          connector.classList.add("active");
        }
      }

      const stepOrderVal: number = stepOrder(step.id);
      const dot: HTMLElement = this.stepIndicator.createSpan({
        cls: "wizard-dot",
        text: step.num,
      });

      if (stepOrderVal === currentOrder) {
        dot.classList.add("active");
      } else if (stepOrderVal < currentOrder) {
        dot.classList.add("completed");
      }

      dot.createSpan({ cls: "wizard-dot-label", text: step.label });

      dot.addEventListener("click", (): void => {
        if (step.id === "info" && this.currentStep !== "info") {
          void this.showStep("info");
        } else if (step.id === "preview" && this.currentStep === "publish") {
          void this.showStep("preview");
        }
      });
    }
  }

  private applyModalSize(mode: "compact" | "expanded"): void {
    const { modalEl } = this;
    modalEl.removeClass("wizard-modal-expanded", "wizard-modal-compact");
    modalEl.addClass("wizard-modal-flex");
    if (mode === "expanded") {
      modalEl.addClass("wizard-modal-expanded");
    } else {
      modalEl.addClass("wizard-modal-compact");
    }
  }

  private syncModalHeight(): void {
    const { modalEl, stepIndicator, contentArea, navButtons } = this;
    if (this.currentStep === "preview") return;

    const total: number = (stepIndicator.clientHeight || 0) + (contentArea.scrollHeight || 0) + (navButtons.clientHeight || 0);
    modalEl.setCssProps({ height: `${total}px` });
  }

  private reflowLayout(containerHeight: number): void {
    if (this.currentStep !== "preview") return;

    const headerH: number = this.stepIndicator?.offsetHeight ?? 0;
    const footerH: number = this.navButtons?.offsetHeight ?? 0;
    const available: number = Math.max(0, containerHeight - headerH - footerH);

    this.contentArea.setCssProps({ height: `${available}px` });
    if (this.previewLayout !== null) {
      this.previewLayout.setCssProps({ height: `${available}px` });
      if (this.previewFrame !== undefined) {
        this.previewFrame.setCssProps({ height: `${Math.max(0, available - 48)}px` });
      }
    }
  }

  private async showStep(step: WizardStep): Promise<void> {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const direction: "forward" | "back" =
      stepOrder(step) > stepOrder(this.currentStep) ? "forward" : "back";

    this.contentArea.classList.remove("visible");
    this.contentArea.classList.add(
      direction === "forward" ? "fade-out-forward" : "fade-out-back",
    );

    // Trigger modal size change during fade-out so both animate together
    this.applyModalSize(step === "preview" ? "expanded" : "compact");

    await this.waitTransition(400);

    this.currentStep = step;
    this.renderStepIndicator();
    this.contentArea.empty();
    this.contentArea.setCssProps({});
    this.navButtons.empty();

    this.contentArea.classList.remove("fade-out-forward", "fade-out-back");
    this.contentArea.classList.add(
      direction === "forward" ? "fade-in-forward" : "fade-in-back",
    );

    switch (step) {
      case "info":
        this.renderInfoStep();
        break;
      case "preview":
        this.renderPreviewStep();
        break;
      case "publish":
        this.renderPublishStep();
        break;
    }

    if (step !== "preview") {
      window.requestAnimationFrame((): void => {
        window.requestAnimationFrame((): void => {
          this.syncModalHeight();
        });
      });
    }

    window.requestAnimationFrame((): void => {
      window.requestAnimationFrame((): void => {
        this.contentArea.classList.remove("fade-in-forward", "fade-in-back");
        this.contentArea.classList.add("visible");
        this.isTransitioning = false;
        if (step === "preview") {
          this.reflowLayout(this.modalEl.clientHeight);
        }
      });
    });
  }

  private waitTransition(ms: number): Promise<void> {
    return new Promise((resolve: () => void): void => {
      window.setTimeout(resolve, ms);
    });
  }

  private renderInfoStep(): void {
    const settings: PluginSettings = this.getSettings();
    const infoStep: HTMLElement = this.contentArea.createDiv({ cls: "wizard-info-step" });

    infoStep.createEl("label", { text: "Site Title", cls: "wizard-label" });
    this.titleInput = infoStep.createEl("input", {
      cls: "wizard-input",
      value: settings.siteTitle,
    });

    infoStep.createEl("label", { text: "Site Description", cls: "wizard-label" });
    this.descInput = infoStep.createEl("textarea", {
      cls: "wizard-textarea",
    });
    this.descInput.value = settings.siteDescription;

    infoStep.createEl("label", { text: "GitHub Repository", cls: "wizard-label" });
    this.repoInput = infoStep.createEl("input", {
      cls: "wizard-input",
      value: settings.repoName,
    });

    infoStep.createEl("label", { text: "Publish Branch", cls: "wizard-label" });
    this.branchInput = infoStep.createEl("input", {
      cls: "wizard-input",
      value: settings.publishBranch,
    });

    const fileCount: number = settings.selectedNotes.length;
    infoStep.createDiv({
      cls: "wizard-file-summary",
      text: `● ${fileCount} note${fileCount !== 1 ? "s" : ""} selected`,
    });

    const nextBtn: HTMLButtonElement = this.navButtons.createEl("button", {
      text: "Next → Preview",
      cls: "mod-cta",
    });
    nextBtn.addEventListener("click", (): void => {
      void this.showStep("preview");
    });
  }

  private renderPreviewStep(): void {
    this.previewLayout = this.contentArea.createDiv({ cls: "wizard-preview-layout" });

    const previewArea: HTMLElement = this.previewLayout.createDiv({ cls: "wizard-preview-area" });

    const previewControls: HTMLElement = previewArea.createDiv({ cls: "wizard-preview-controls" });
    previewControls.createSpan({ text: "Preview Theme: ", cls: "wizard-label" });
    this.previewThemeSelect = previewControls.createEl("select", { cls: "wizard-select" });
    const settings: PluginSettings = this.getSettings();
    this.populateThemeOptions(this.previewThemeSelect, settings.themeId);
    this.previewThemeSelect.addEventListener("change", (): void => {
      void this.refreshPreview();
    });

    const fullPreviewBtn: HTMLButtonElement = previewControls.createEl("button", {
      cls: "wizard-full-preview-btn",
      text: "Preview Full Site",
    });
    fullPreviewBtn.addEventListener("click", (): void => {
      void this.generateAndShowFullPreview(fullPreviewBtn);
    });

    this.previewFrame = previewArea.createEl("iframe", { cls: "wizard-preview-frame-styles" });

    const backBtn: HTMLButtonElement = this.navButtons.createEl("button", { text: "← Back" });
    backBtn.addEventListener("click", (): void => {
      void this.showStep("info");
    });

    const publishBtn: HTMLButtonElement = this.navButtons.createEl("button", {
      text: "Publish →",
      cls: "mod-cta",
    });
    publishBtn.addEventListener("click", (): void => {
      void this.showStep("publish");
    });

    void this.refreshPreview();
  }

  private writePreviewHtml(html: string): void {
    if (this.previewFrame === undefined) return;
    this.previewFrame.srcdoc = html;
  }

  private async refreshPreview(): Promise<void> {
    try {
      const settings: PluginSettings = this.getSettings();
      const selectedPaths: string[] = settings.selectedNotes;

      if (selectedPaths.length === 0) {
        this.writePreviewHtml("<html><body><p>No notes selected for preview.</p></body></html>");
        return;
      }

      const vaultRepo = container.resolve<VaultRepositoryPort>(DI_TOKENS.VaultRepository);
      const firstPath: string = selectedPaths[0] ?? "";

      let publishFile: PublishFile;
      try {
        publishFile = await vaultRepo.getPublishFile(firstPath);
      } catch {
        this.writePreviewHtml("<html><body><p>Preview file not found.</p></body></html>");
        return;
      }

      let css: string;
      const themeId: string = this.previewThemeSelect?.value ?? settings.themeId;
      const themeService = container.resolve<ThemeService>(DI_TOKENS.ThemeService);
      css = await themeService.getThemeCSS(themeId);
      if (css.length === 0) {
        css = (BUILT_IN_PREVIEW_CSS[themeId] ?? BUILT_IN_PREVIEW_CSS.default) as string;
      }

      const siteTitle: string = this.titleInput?.value ?? settings.siteTitle;

      const siteConfig: SiteConfig = {
        title: siteTitle,
        description: this.descInput?.value ?? settings.siteDescription,
        baseUrl: "/",
        themeId,
        githubToken: "",
        githubOwner: "",
        githubRepo: "",
        githubBranch: "",
        isPro: false,
        customCss: css,
      };

      const siteGenerator = container.resolve<SiteGeneratorService>(DI_TOKENS.SiteGeneratorService);
      const generatedFile = await siteGenerator.generateFile(publishFile, siteConfig);

      const noteContent: string = extractMainContent(generatedFile.html);
      this.writePreviewHtml(buildNotePreviewHtml(noteContent, css, siteTitle));
    } catch (error: unknown) {
      const msg: string = error instanceof Error ? error.message : String(error);
      this.writePreviewHtml(`<html><body><p>Preview error: ${this.escapeHtml(msg)}</p></body></html>`);
    }
  }

  private async generateAndShowFullPreview(btn: HTMLButtonElement): Promise<void> {
    const originalText: string = btn.textContent ?? "Preview Full Site";
    btn.textContent = "Generating...";
    btn.disabled = true;

    try {
      const html: string = await this.generateFullPreview();
      this.writePreviewHtml(html);
    } catch (error: unknown) {
      const msg: string = error instanceof Error ? error.message : String(error);
      this.writePreviewHtml(`<html><body><p>Full preview error: ${this.escapeHtml(msg)}</p></body></html>`);
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  }

  private async generateFullPreview(): Promise<string> {
    const settings: PluginSettings = this.getSettings();
    const selectedPaths: string[] = settings.selectedNotes;

    if (selectedPaths.length === 0) {
      return "<html><body><p>No notes selected for preview.</p></body></html>";
    }

    const vaultRepo = container.resolve<VaultRepositoryPort>(DI_TOKENS.VaultRepository);
    const files: PublishFile[] = [];
    for (const path of selectedPaths) {
      try {
        const pf: PublishFile = await vaultRepo.getPublishFile(path);
        files.push(pf);
      } catch {
        continue;
      }
    }

    if (files.length === 0) {
      return "<html><body><p>No readable notes found for preview.</p></body></html>";
    }

    let css: string;
    const themeId: string = this.previewThemeSelect?.value ?? settings.themeId;
    const themeService = container.resolve<ThemeService>(DI_TOKENS.ThemeService);
    css = await themeService.getThemeCSS(themeId);
    if (css.length === 0) {
      css = (BUILT_IN_PREVIEW_CSS[themeId] ?? BUILT_IN_PREVIEW_CSS.default) as string;
    }

    const siteConfig: SiteConfig = {
      title: this.titleInput?.value ?? settings.siteTitle,
      description: this.descInput?.value ?? settings.siteDescription,
      baseUrl: "/",
      themeId,
      githubToken: "",
      githubOwner: "",
      githubRepo: "",
      githubBranch: "",
      isPro: false,
      customCss: css,
    };

    const siteGenerator = container.resolve<SiteGeneratorService>(DI_TOKENS.SiteGeneratorService);
    const generatedSite: GeneratedSite = await siteGenerator.generateSite(files, siteConfig);

    return this.buildFullPreviewHtml(generatedSite, siteConfig.title, css, themeId);
  }

  private buildFullPreviewHtml(
    generatedSite: GeneratedSite,
    siteTitle: string,
    css: string,
    themeId: string,
  ): string {
    const navItemsHtml: string = generatedSite.navigation
      .filter((item: NavItem): boolean => !item.path.startsWith("page/") && !item.path.startsWith("tags/"))
      .map((item: NavItem): string => {
        const slug: string = pathToPreviewSlug(item.path);
        return `<a href="javascript:void(0)" class="preview-nav-link" data-page="${escapeHtmlPreview(slug)}">${escapeHtmlPreview(item.title)}</a>`;
      })
      .join("\n");

    const pagesHtml: string = generatedSite.files
      .filter((f): boolean => !f.relativePath.startsWith("page/") && !f.relativePath.startsWith("tags/"))
      .map((f): string => {
        const slug: string = pathToPreviewSlug(f.relativePath);
        const mainContent: string = extractMainContent(f.html);
        return `<div class="preview-page" id="page-${escapeHtmlPreview(slug)}">${mainContent}</div>`;
      })
      .join("\n");

    return `<!DOCTYPE html>
<html lang="en" data-theme="${escapeHtmlPreview(themeId)}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Full Preview — ${escapeHtmlPreview(siteTitle)}</title>
  <style>${FULL_PREVIEW_CHROME_CSS}</style>
  <style>${css}</style>
</head>
<body>
  <header class="garden-nav">
    <div class="garden-nav-header">
      <div class="garden-brand">
        <div class="garden-logo"></div>
        <a href="#" class="garden-site-title">${escapeHtmlPreview(siteTitle)}</a>
      </div>
      <button class="preview-sidebar-toggle" onclick="toggleSidebar()" aria-label="Toggle navigation">
        <span class="garden-menu-icon"></span>
      </button>
    </div>
  </header>
  <main class="garden-content" id="preview-content">
    <p class="preview-placeholder">Select a page from the sidebar to preview.</p>
    ${pagesHtml}
  </main>
  <footer class="garden-footer">
    <div class="garden-footer-inner">
      <p>Cultivated with <a href="https://obsidian-garden.ai" target="_blank" rel="noopener">Garden</a></p>
    </div>
  </footer>
  <aside class="preview-sidebar" id="preview-sidebar">
    <div class="preview-sidebar-header">
      <span class="preview-sidebar-title">${escapeHtmlPreview(siteTitle)}</span>
    </div>
    <nav class="preview-sidebar-nav">${navItemsHtml}</nav>
  </aside>
  <div class="preview-sidebar-overlay" id="preview-overlay" onclick="toggleSidebar()"></div>
  <script>${FULL_PREVIEW_SCRIPT}</script>
</body>
</html>`;
  }

  private renderPublishStep(): void {
    const publishStep: HTMLElement = this.contentArea.createDiv({ cls: "wizard-publish-step" });

    publishStep.createEl("h3", { text: "Publishing...", cls: "wizard-publish-progress" });

    this.progressBar = publishStep.createEl("progress", { cls: "publish-progress-bar" });
    this.progressBar.max = 100;
    this.progressBar.value = 0;

    this.stepText = publishStep.createDiv({
      cls: "setting-item-description",
      text: "Starting...",
    });

    this.resultSection = publishStep.createDiv({ cls: "publish-result" });

    void this.doPublish();
  }

  private async doPublish(): Promise<void> {
    if (this.isPublishing) return;
    this.isPublishing = true;

    const settings: PluginSettings = this.getSettings();
    const selectedNotes: string[] = settings.selectedNotes;

    if (selectedNotes.length === 0) {
      new Notice("No files selected. Select files in the Note Selector first.");
      this.isPublishing = false;
      this.close();
      return;
    }

    let token: string = settings.githubToken;
    if (token === "") {
      new Notice("No GitHub token found. Please add one in Settings.");
      this.isPublishing = false;
      this.close();
      return;
    }

    const publisher = container.resolve<PublisherService>(DI_TOKENS.PublisherService);

    const wizardRepo: string = this.repoInput?.value ?? settings.repoName;
    const themeId: string = this.previewThemeSelect?.value ?? settings.themeId;

    const siteConfig: SiteConfig = {
      title: this.titleInput?.value ?? settings.siteTitle,
      description: this.descInput?.value ?? settings.siteDescription,
      baseUrl: `https://${settings.githubUsername}.github.io/${wizardRepo}`,
      themeId,
      githubToken: token,
      githubOwner: settings.githubUsername,
      githubRepo: wizardRepo,
      githubBranch: this.branchInput?.value ?? settings.publishBranch,
      isPro: false,
      customCss: undefined,
    };

    const logger = container.resolve<LoggerPort>(DI_TOKENS.LoggerService);

    try {
      const result: PublishResult = await ErrorBoundary.wrap(
        async (): Promise<PublishResult> =>
          publisher.publish(
            selectedNotes,
            siteConfig,
            (progress: PublishProgress): void => {
              this.updateProgress(progress);
            },
            10,
          ),
        "PublishWizard.doPublish",
        logger,
      );

      this.isPublishing = false;

      if (result.success) {
        this.showSuccess(result);
      } else {
        this.showError(result);
      }
    } catch (error: unknown) {
      this.isPublishing = false;
      const msg: string = error instanceof Error ? error.message : String(error);
      new Notice(`Publish failed: ${msg}`);
      this.showError({
        success: false,
        notesPublished: 0,
        elapsedMs: 0,
        wasIncremental: false,
        error: msg,
      });
    }
  }

  private updateProgress(progress: PublishProgress): void {
    this.progressBar.value = progress.percent;
    this.stepText.setText(progress.message);
  }

  private showSuccess(result: PublishResult): void {
    this.progressBar.addClass("wizard-hidden");
    const progressTitle: HTMLElement | null = this.contentArea.querySelector(".wizard-publish-progress");
    if (progressTitle !== null) {
      progressTitle.textContent = "Published!";
      progressTitle.classList.remove("wizard-publish-progress");
    }
    this.stepText.setText("");
    this.resultSection.empty();
    this.resultSection.removeClass("wizard-hidden");
    this.resultSection.classList.add("wizard-publish-success");

    this.resultSection.createDiv({
      cls: "setting-item-info",
      text: `${result.notesPublished} notes deployed.`,
    });

    if (result.siteUrl !== undefined) {
      this.resultSection.createDiv({
        cls: "setting-item-description",
        text: result.siteUrl,
      });

      const viewBtn: HTMLButtonElement = this.resultSection.createEl("button", {
        text: "View Site",
        cls: "mod-cta",
      });
      viewBtn.addEventListener("click", (): void => {
        if (result.siteUrl !== undefined) {
          open(result.siteUrl);
        }
      });
    }

    this.resultSection.createEl("button", {
      text: "Close",
    }).addEventListener("click", (): void => {
      this.close();
    });
  }

  private showError(result: PublishResult): void {
    this.progressBar.addClass("wizard-hidden");
    const progressTitle: HTMLElement | null = this.contentArea.querySelector(".wizard-publish-progress");
    if (progressTitle !== null) {
      progressTitle.textContent = "Publish failed";
      progressTitle.classList.remove("wizard-publish-progress");
    }
    this.stepText.setText("");
    this.resultSection.empty();
    this.resultSection.removeClass("wizard-hidden");
    this.resultSection.classList.add("wizard-publish-error");

    this.resultSection.createDiv({
      cls: "setting-item-error",
      text: result.error ?? "Unknown error",
    });

    const retryBtn: HTMLButtonElement = this.resultSection.createEl("button", {
      text: "Retry",
      cls: "mod-cta",
    });
    retryBtn.addEventListener("click", (): void => {
      this.resultSection.empty();
      this.progressBar.removeClass("wizard-hidden");
      void this.doPublish();
    });
  }

  private populateThemeOptions(select: HTMLSelectElement, selectedId: string): void {
    select.empty();

    const themes: Array<{ id: string; name: string }> = [
      { id: "default", name: "Default Light" },
      { id: "dark", name: "Dark Mode" },
    ];

    for (const theme of themes) {
      const opt: HTMLOptionElement = select.createEl("option", { value: theme.id, text: theme.name });
      if (theme.id === selectedId) {
        opt.selected = true;
      }
    }
  }

  private getSettings(): PluginSettings {
    const configService = container.resolve<PluginConfigService>(DI_TOKENS.PluginConfigService);
    return configService.getAll();
  }

  private escapeHtml(text: string): string {
    const div: HTMLDivElement = getDoc().createElement("div");
    div.appendChild(getDoc().createTextNode(text));
    return div.innerHTML;
  }

  private injectStyles(): void {
    // CSS is now in styles.css
  }
}

function stepOrder(step: WizardStep): number {
  switch (step) {
    case "info": return 0;
    case "preview": return 1;
    case "publish": return 2;
  }
}

const FULL_PREVIEW_CHROME_CSS: string = `
.preview-sidebar { position: fixed; top: 0; left: 0; width: 220px; height: 100%; background: var(--background-secondary, #f2f0eb); border-right: 1px solid var(--background-modifier-border, #e7e5e4); overflow-y: auto; z-index: 100; transform: translateX(-100%); transition: transform 0.3s ease; display: flex; flex-direction: column; }
.preview-sidebar.open { transform: translateX(0); }
.preview-sidebar-header { padding: 16px 14px 12px; border-bottom: 1px solid var(--background-modifier-border, #e7e5e4); flex-shrink: 0; }
.preview-sidebar-title { font-family: Georgia, serif; font-size: 1rem; font-weight: 600; color: var(--text-normal, #1c1917); letter-spacing: -0.02em; }
.preview-sidebar-nav { display: flex; flex-direction: column; padding: 8px 0; flex: 1; overflow-y: auto; }
.preview-sidebar-nav .preview-nav-link { display: block; padding: 6px 14px; font-size: 0.82rem; color: var(--text-muted, #44403c); text-decoration: none; cursor: pointer; transition: background 0.15s ease; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.preview-sidebar-nav .preview-nav-link:hover { background: rgba(79, 70, 229, 0.08); color: var(--text-accent, #4f46e5); }
.preview-sidebar-nav .preview-nav-link.active { background: rgba(79, 70, 229, 0.12); color: var(--text-accent, #4f46e5); font-weight: 500; }
.preview-sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 99; display: none; }
.preview-sidebar-overlay.visible { display: block; }
.preview-placeholder { color: var(--text-faint, #a8a29e); font-size: 0.9rem; padding: 48px 24px; text-align: center; }
.preview-page { display: none; }
.preview-page.visible { display: block; }
`.trim();

const FULL_PREVIEW_SCRIPT: string = `
(function() {
  var links = document.querySelectorAll('.preview-sidebar-nav .preview-nav-link');
  var pages = document.querySelectorAll('.preview-page');
  var placeholder = document.querySelector('.preview-placeholder');
  var sidebar = document.getElementById('preview-sidebar');
  var overlay = document.getElementById('preview-overlay');

  window.toggleSidebar = function() {
    if (!sidebar || !overlay) return;
    var isOpen = sidebar.classList.contains('open');
    if (isOpen) {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
    } else {
      sidebar.classList.add('open');
      overlay.classList.add('visible');
    }
  };

  function showPage(slug) {
    var found = false;
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].id === 'page-' + slug) {
        pages[i].classList.add('visible');
        found = true;
      } else {
        pages[i].classList.remove('visible');
      }
    }
    if (placeholder) {
      placeholder.style.display = found ? 'none' : '';
    }
    for (var j = 0; j < links.length; j++) {
      var linkSlug = links[j].getAttribute('data-page');
      if (linkSlug === slug) {
        links[j].classList.add('active');
      } else {
        links[j].classList.remove('active');
      }
    }
    if (sidebar && overlay) {
      sidebar.classList.remove('open');
      overlay.classList.remove('visible');
    }
  }

  for (var k = 0; k < links.length; k++) {
    links[k].addEventListener('click', function() {
      var slug = this.getAttribute('data-page');
      if (slug) showPage(slug);
    });
  }
})();
`.trim();

function pathToPreviewSlug(path: string): string {
  return path
    .replace(/\/index\.html$/i, "")
    .replace(/\.html$/i, "")
    .replace(/\//g, "-")
    .toLowerCase();
}

function extractMainContent(html: string): string {
  const mainMatch: RegExpMatchArray | null = html.match(/<main\s+class="garden-content"[^>]*>([\s\S]*)<\/main>/i);
  if (mainMatch?.[1] !== undefined) {
    return mainMatch[1].trim();
  }
  const bodyMatch: RegExpMatchArray | null = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return bodyMatch?.[1]?.trim() ?? html;
}

const BUILT_IN_PREVIEW_CSS: Record<string, string> = {
  default: `
* { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; -webkit-text-size-adjust: 100%; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; color: #1c1917; background: #faf9f6; line-height: 1.75; min-height: 100vh; -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4 { font-family: Georgia, 'Times New Roman', serif; line-height: 1.32; font-weight: 600; letter-spacing: -0.02em; }
.garden-nav { background: rgba(250, 249, 246, 0.82); backdrop-filter: blur(16px) saturate(1.8); border-bottom: 1px solid #e7e5e4; }
.garden-nav-header { display: flex; align-items: center; height: 60px; max-width: 800px; margin: 0 auto; padding: 0 24px; }
.garden-brand { display: flex; align-items: center; gap: 10px; }
.garden-logo { width: 28px; height: 28px; background: linear-gradient(135deg, #059669, #10b981); border-radius: 7px; display: grid; place-items: center; box-shadow: 0 1px 3px rgba(5,150,105,0.3); }
.garden-logo::after { content: ""; width: 10px; height: 10px; border: 2px solid rgba(255,255,255,0.9); border-radius: 50% 50% 50% 0; transform: rotate(-45deg); }
.garden-site-title { font-family: Georgia, serif; font-size: 1.15rem; font-weight: 600; color: #1c1917; text-decoration: none; letter-spacing: -0.02em; }
.garden-content { max-width: 680px; margin: 0 auto; padding: 48px 24px 80px; }
.garden-content h1 { font-size: 2.2rem; font-weight: 600; margin-bottom: 12px; line-height: 1.25; }
.garden-content h2 { font-size: 1.35rem; font-weight: 600; margin: 2rem 0 0.75rem; padding-bottom: 0.4rem; border-bottom: 1px solid #e7e5e4; }
.garden-content h3 { font-size: 1.1rem; font-weight: 600; margin: 1.5rem 0 0.6rem; }
.garden-content p { margin-bottom: 1.1rem; }
.garden-content a { color: #4f46e5; text-decoration: none; border-bottom: 1px solid rgba(79,70,229,0.08); transition: border-color 0.15s ease; }
.garden-content a:hover { border-bottom-color: #4f46e5; }
.garden-content code { background: #f5f5f4; padding: 0.15rem 0.4rem; border-radius: 4px; font-family: 'SF Mono', 'Fira Code', Consolas, monospace; font-size: 0.84em; color: #4338ca; }
.garden-content pre { background: #f2f0eb; border: 1px solid #e7e5e4; padding: 1rem 1.2rem; border-radius: 8px; overflow-x: auto; margin: 1.2rem 0; line-height: 1.6; }
.garden-content pre code { padding: 0; background: none; font-size: 0.86rem; color: inherit; }
.garden-content blockquote { border-left: 3px solid #d97706; padding: 0.75rem 1.1rem; margin: 1.2rem 0; color: #78716c; font-style: italic; background: rgba(217,119,6,0.1); border-radius: 0 6px 6px 0; }
.garden-content ul, .garden-content ol { margin: 0 0 1.1rem 1.5rem; }
.garden-content li { margin-bottom: 0.35rem; }
.garden-content li::marker { color: #d97706; }
.garden-content img { max-width: 100%; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.04); }
.garden-content hr { border: none; height: 1px; background: #e7e5e4; margin: 2rem 0; }
.garden-content table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 1.2rem 0; font-size: 0.9rem; border: 1px solid #e7e5e4; border-radius: 8px; overflow: hidden; }
.garden-content th { background: #f2f0eb; font-weight: 600; text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #78716c; }
.garden-content th, .garden-content td { border-bottom: 1px solid #e7e5e4; padding: 0.55rem 0.8rem; }
.garden-content tbody tr:last-child td { border-bottom: none; }
.garden-content tbody tr:nth-child(even) { background: #f2f0eb; }
.garden-content strong { font-weight: 600; }
`.trim(),

  dark: `
* { box-sizing: border-box; margin: 0; padding: 0; }
html { font-size: 16px; -webkit-text-size-adjust: 100%; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; color: #fafaf9; background: #0c0a09; line-height: 1.75; min-height: 100vh; -webkit-font-smoothing: antialiased; }
h1, h2, h3, h4 { font-family: Georgia, 'Times New Roman', serif; line-height: 1.32; font-weight: 600; letter-spacing: -0.02em; }
.garden-nav { background: rgba(12, 10, 9, 0.85); backdrop-filter: blur(16px) saturate(1.8); border-bottom: 1px solid #44403c; }
.garden-nav-header { display: flex; align-items: center; height: 60px; max-width: 800px; margin: 0 auto; padding: 0 24px; }
.garden-brand { display: flex; align-items: center; gap: 10px; }
.garden-logo { width: 28px; height: 28px; background: linear-gradient(135deg, #059669, #10b981); border-radius: 7px; display: grid; place-items: center; box-shadow: 0 1px 3px rgba(5,150,105,0.3); }
.garden-logo::after { content: ""; width: 10px; height: 10px; border: 2px solid rgba(255,255,255,0.9); border-radius: 50% 50% 50% 0; transform: rotate(-45deg); }
.garden-site-title { font-family: Georgia, serif; font-size: 1.15rem; font-weight: 600; color: #fafaf9; text-decoration: none; letter-spacing: -0.02em; }
.garden-content { max-width: 680px; margin: 0 auto; padding: 48px 24px 80px; }
.garden-content h1 { font-size: 2.2rem; font-weight: 600; margin-bottom: 12px; line-height: 1.25; }
.garden-content h2 { font-size: 1.35rem; font-weight: 600; margin: 2rem 0 0.75rem; padding-bottom: 0.4rem; border-bottom: 1px solid #44403c; }
.garden-content h3 { font-size: 1.1rem; font-weight: 600; margin: 1.5rem 0 0.6rem; }
.garden-content p { margin-bottom: 1.1rem; }
.garden-content a { color: #818cf8; text-decoration: none; border-bottom: 1px solid rgba(129,140,248,0.12); transition: border-color 0.15s ease; }
.garden-content a:hover { border-bottom-color: #818cf8; }
.garden-content code { background: #292524; padding: 0.15rem 0.4rem; border-radius: 4px; font-family: 'SF Mono', 'Fira Code', Consolas, monospace; font-size: 0.84em; color: #a5b4fc; }
.garden-content pre { background: #0c0a09; border: 1px solid #44403c; padding: 1rem 1.2rem; border-radius: 8px; overflow-x: auto; margin: 1.2rem 0; line-height: 1.6; }
.garden-content pre code { padding: 0; background: none; font-size: 0.86rem; color: inherit; }
.garden-content blockquote { border-left: 3px solid #fbbf24; padding: 0.75rem 1.1rem; margin: 1.2rem 0; color: #a8a29e; font-style: italic; background: rgba(251,191,36,0.1); border-radius: 0 6px 6px 0; }
.garden-content ul, .garden-content ol { margin: 0 0 1.1rem 1.5rem; }
.garden-content li { margin-bottom: 0.35rem; }
.garden-content li::marker { color: #fbbf24; }
.garden-content img { max-width: 100%; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.35), 0 1px 2px -1px rgba(0,0,0,0.25); }
.garden-content hr { border: none; height: 1px; background: #44403c; margin: 2rem 0; }
.garden-content table { width: 100%; border-collapse: separate; border-spacing: 0; margin: 1.2rem 0; font-size: 0.9rem; border: 1px solid #44403c; border-radius: 8px; overflow: hidden; }
.garden-content th { background: #292524; font-weight: 600; text-align: left; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; color: #a8a29e; }
.garden-content th, .garden-content td { border-bottom: 1px solid #44403c; padding: 0.55rem 0.8rem; }
.garden-content tbody tr:last-child td { border-bottom: none; }
.garden-content tbody tr:nth-child(even) { background: #292524; }
.garden-content strong { font-weight: 600; }
`.trim(),
};

function buildNotePreviewHtml(content: string, css: string, siteTitle: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Preview — ${escapeHtmlPreview(siteTitle)}</title>
  <style>${css}</style>
</head>
<body>
  <header class="garden-nav">
    <div class="garden-nav-header">
      <div class="garden-brand">
        <div class="garden-logo"></div>
        <a href="#" class="garden-site-title">${escapeHtmlPreview(siteTitle)}</a>
      </div>
    </div>
  </header>
  <main class="garden-content">
    ${content}
  </main>
  <footer class="garden-footer">
    <div class="garden-footer-inner">
      <p>Cultivated with <a href="https://obsidian-garden.ai" target="_blank" rel="noopener">Garden</a></p>
    </div>
  </footer>
</body>
</html>`;
}

function escapeHtmlPreview(text: string): string {
  const div: HTMLDivElement = getDoc().createElement("div");
  div.appendChild(getDoc().createTextNode(text));
  return div.innerHTML;
}