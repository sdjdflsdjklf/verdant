import { ItemView, type WorkspaceLeaf, type Plugin, type TFile } from "obsidian";
import type { PluginSettings } from "../../types/plugin.types";
import { FREE_TIER_MAX_NOTES } from "../../constants/limits.constants";
import { container } from "../../di/container";
import { DI_TOKENS } from "../../di/tokens";
import type { PluginConfigService } from "../../config/plugin-config.service";

export const VIEW_TYPE_NOTE_SELECTOR = "obsidian-garden-note-selector";

interface FileNode {
  name: string;
  path: string;
  children: FileNode[];
  isFolder: boolean;
  file?: TFile;
}

export class NoteSelectorView extends ItemView {
  private readonly plugin: Plugin;
  private selectedFiles: Set<string> = new Set();
  private searchQuery: string = "";
  private treeContainer!: HTMLElement;
  public onPublishRequest: (() => void) | null = null;

  constructor(leaf: WorkspaceLeaf, plugin: Plugin) {
    super(leaf);
    this.plugin = plugin;
    this.loadSelectedFiles();
  }

  public getViewType(): string {
    return VIEW_TYPE_NOTE_SELECTOR;
  }

  public getDisplayText(): string {
    return "Note Selector";
  }

  public getIcon(): string {
    return "globe";
  }

  public async onOpen(): Promise<void> {
    const { contentEl } = this;
    contentEl.empty();
    contentEl.addClass("note-selector-view");

    this.buildSearchBar(contentEl);
    this.treeContainer = contentEl.createDiv({ cls: "tree-container" });
    this.buildActionBar(contentEl);
    this.renderTree();
  }

  public async onClose(): Promise<void> {
    this.selectionCallback = null;
    this.onPublishRequest = null;
    this.contentEl.empty();
  }

  public getSelectedFiles(): string[] {
    return Array.from(this.selectedFiles);
  }

  private buildSearchBar(container: HTMLElement): void {
    const searchContainer = container.createDiv({ cls: "garden-search-container" });
    const searchInput = searchContainer.createEl("input", {
      type: "text",
      placeholder: "Search notes...",
      cls: "garden-search-field",
    });
    searchInput.addEventListener("input", (): void => {
      this.searchQuery = searchInput.value;
      this.renderTree();
    });
  }

  private buildActionBar(container: HTMLElement): void {
    const actionBar = container.createDiv({ cls: "nav-buttons-container" });
    const maxNotes: number = this.getMaxNotes();

    const selectAllBtn = actionBar.createEl("button", {
      text: "Select All",
      cls: "clickable-icon",
    });
    selectAllBtn.addEventListener("click", (): void => {
      this.selectAll();
    });

    const clearBtn = actionBar.createEl("button", {
      text: "Clear",
      cls: "clickable-icon",
    });
    clearBtn.addEventListener("click", (): void => {
      this.clearSelection();
    });

    const counter = actionBar.createSpan({ cls: "tree-item-inner" });
    const displayMax: string = `${maxNotes}`;
    counter.setText(`${this.selectedFiles.size} / ${displayMax} selected`);

    actionBar.createSpan({ cls: "tree-item-inner" });

    const publishBtn = actionBar.createEl("button", {
      text: "Publish",
      cls: "mod-cta",
    });
    publishBtn.addEventListener("click", (): void => {
      this.onPublishRequest?.();
    });

    // Update counter when selection changes
    this.registerSelectionCallback((): void => {
      const displayMax: string = `${maxNotes}`;
      counter.setText(`${this.selectedFiles.size} / ${displayMax} selected`);
    });
  }

  private registerSelectionCallback: (callback: () => void) => void = (
    callback: () => void,
  ): void => {
    this.selectionCallback = callback;
  };

  private selectionCallback: (() => void) | null = null;

  private renderTree(): void {
    this.treeContainer.empty();

    const vault = this.plugin.app.vault;
    const markdownFiles: TFile[] = vault.getMarkdownFiles();

    if (this.searchQuery !== "") {
      this.renderFlatList(this.treeContainer, markdownFiles);
    } else {
      this.renderFolderTree(this.treeContainer, markdownFiles);
    }
  }

  private renderFlatList(container: HTMLElement, files: TFile[]): void {
    const query: string = this.searchQuery.toLowerCase();
    const filtered = files.filter((f: TFile): boolean => {
      return f.path.toLowerCase().includes(query);
    });

    const listEl = container.createDiv({ cls: "tree-item" });
    for (const file of filtered) {
      this.renderFileRow(listEl, file);
    }

    if (filtered.length === 0) {
      container.createSpan({ cls: "tree-item-inner", text: "No matching notes" });
    }
  }

  private renderFolderTree(container: HTMLElement, files: TFile[]): void {
    const root: FileNode = this.buildFileTree(files);
    for (const child of root.children) {
      this.renderNode(container, child, 0);
    }
  }

  private buildFileTree(files: TFile[]): FileNode {
    const root: FileNode = {
      name: "root",
      path: "",
      children: [],
      isFolder: true,
    };

    for (const file of files) {
      const parts: string[] = file.path.split("/");
      let current: FileNode = root;

      for (let i = 0; i < parts.length - 1; i++) {
        const part: string = parts[i] ?? "";
        let child: FileNode | undefined = current.children.find(
          (n: FileNode): boolean => n.name === part && n.isFolder,
        );
        if (child === undefined) {
          child = {
            name: part,
            path: parts.slice(0, i + 1).join("/"),
            children: [],
            isFolder: true,
          };
          current.children.push(child);
        }
        current = child;
      }

      const fileName: string = parts[parts.length - 1] ?? file.name;
      current.children.push({
        name: fileName,
        path: file.path,
        children: [],
        isFolder: false,
        file,
      });
    }

    // Sort folders first, then alphabetical
    this.sortNodes(root);
    return root;
  }

  private sortNodes(node: FileNode): void {
    node.children.sort((a: FileNode, b: FileNode): number => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name);
    });
    for (const child of node.children) {
      if (child.isFolder) {
        this.sortNodes(child);
      }
    }
  }

  private renderNode(
    container: HTMLElement,
    node: FileNode,
    depth: number,
  ): void {
    if (node.isFolder && node.file !== undefined) {
      return;
    }

    if (node.isFolder) {
      this.renderFolder(container, node, depth);
    } else {
      this.renderFile(container, node, depth);
    }
  }

  private renderFolder(
    container: HTMLElement,
    node: FileNode,
    depth: number,
  ): void {
    const folderDiv = container.createDiv({ cls: "tree-item" });

    const folderSelf = folderDiv.createDiv({
      cls: "tree-item-self is-clickable",
    });
    folderSelf.style.setProperty("padding-left", `${Math.min(depth, 12) * 16}px`);

    const collapseIcon = folderSelf.createDiv({ cls: "tree-item-icon collapse-icon" });
    collapseIcon.setText("▼");

    folderSelf.createDiv({
      cls: "tree-item-icon",
      text: "📁",
    });

    folderSelf.createDiv({
      cls: "tree-item-inner",
      text: node.name,
    });

    const childrenContainer = folderDiv.createDiv({
      cls: "tree-item-children",
    });

    // Toggle collapse on click
    folderSelf.addEventListener("click", (): void => {
      const isCollapsed = childrenContainer.style.display === "none";
      childrenContainer.style.display = isCollapsed ? "" : "none";
      collapseIcon.setText(isCollapsed ? "▼" : "▶");
    });

    for (const child of node.children) {
      this.renderNode(childrenContainer, child, depth + 1);
    }
  }

  private renderFile(
    container: HTMLElement,
    node: FileNode,
    depth: number,
  ): void {
    const fileDiv = container.createDiv({ cls: "tree-item" });

    const fileSelf = fileDiv.createDiv({
      cls: "tree-item-self is-clickable",
    });
    fileSelf.style.setProperty("padding-left", `${Math.min(depth, 12) * 16}px`);

    const checkbox = fileSelf.createEl("input", {
      type: "checkbox",
      cls: "checkbox",
    });
    checkbox.checked = this.selectedFiles.has(node.path);

    checkbox.addEventListener("change", (): void => {
      if (checkbox.checked) {
        this.selectedFiles.add(node.path);
      } else {
        this.selectedFiles.delete(node.path);
      }
      void this.saveSelectedFiles();
      this.notifySelectionChanged();
    });

    const fileLabel = fileSelf.createEl("label", { cls: "tree-item-inner" });
    fileLabel.setText(node.name);

    // Make the entire row clickable to toggle checkbox
    fileSelf.addEventListener("click", (e: MouseEvent): void => {
      if (e.target === checkbox) return;
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event("change"));
    });
  }

  private renderFileRow(container: HTMLElement, file: TFile): void {
    this.renderFile(container, {
      name: file.name,
      path: file.path,
      children: [],
      isFolder: false,
      file,
    }, 0);
  }

  private selectAll(): void {
    const vault = this.plugin.app.vault;
    const markdownFiles: TFile[] = vault.getMarkdownFiles();
    const maxNotes: number = this.getMaxNotes();

    const filesToSelect: TFile[] = markdownFiles.slice(0, maxNotes);
    for (const file of filesToSelect) {
      this.selectedFiles.add(file.path);
    }
    void this.saveSelectedFiles();
    this.renderTree();
    this.notifySelectionChanged();
  }

  private clearSelection(): void {
    this.selectedFiles.clear();
    void this.saveSelectedFiles();
    this.renderTree();
    this.notifySelectionChanged();
  }

  private loadSelectedFiles(): void {
    const configService = container.resolve<PluginConfigService>(DI_TOKENS.PluginConfigService);
    const settings: PluginSettings = configService.getAll();
    this.selectedFiles = new Set(settings.selectedNotes);
  }

  private async saveSelectedFiles(): Promise<void> {
    const configService = container.resolve<PluginConfigService>(DI_TOKENS.PluginConfigService);
    await configService.set("selectedNotes", Array.from(this.selectedFiles));
  }

  private notifySelectionChanged(): void {
    this.selectionCallback?.();
  }

  private getMaxNotes(): number {
    return FREE_TIER_MAX_NOTES;
  }
}
