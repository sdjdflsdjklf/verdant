import type { Plugin } from "obsidian";

export class StatusBarView {
  private readonly statusBarItem: HTMLElement;
  private readonly clickHandler: () => void;

  constructor(plugin: Plugin, onOpenSettings?: () => void) {
    this.statusBarItem = plugin.addStatusBarItem();
    this.statusBarItem.addClass("mod-clickable");
    this.clickHandler = (): void => { onOpenSettings?.(); };
    this.statusBarItem.addEventListener("click", this.clickHandler);
    this.setIdle();
  }

  setIdle(): void {
    this.statusBarItem.setText("◆ Verdant: ready");
  }

  setPublishing(): void {
    this.statusBarItem.setText("◇ Verdant: publishing...");
  }

  setSuccess(count: number): void {
    this.statusBarItem.setText(`● Verdant: ${count} notes published`);
  }

  setError(): void {
    this.statusBarItem.setText("● Verdant: publish failed");
  }

  destroy(): void {
    this.statusBarItem.removeEventListener("click", this.clickHandler);
    this.statusBarItem.remove();
  }
}
