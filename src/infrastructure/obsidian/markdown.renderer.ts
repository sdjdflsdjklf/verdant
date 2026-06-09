import { injectable, inject } from "tsyringe";
import { MarkdownRenderer as ObsidianMarkdownRenderer, Component, type App } from "obsidian";
import type { MarkdownRendererPort } from "../../domain/ports/markdown-renderer.port";
import { DI_TOKENS } from "../../di/tokens";

/**
 * Real implementation of {@link MarkdownRendererPort}.
 *
 * Uses Obsidian's built-in `MarkdownRenderer.render()` to render
 * Markdown content to HTML, matching Obsidian's native rendering
 * (including WikiLinks, embeds, callouts, etc.).
 */
/** Use activeDocument for popout window compatibility. */
function getDoc(): Document {
  return activeDocument;
}

@injectable()
export class MarkdownRenderer implements MarkdownRendererPort {
  constructor(
    @inject(DI_TOKENS.ObsidianApp) private readonly app: App,
  ) {}

  public async render(content: string, sourcePath: string): Promise<string> {
    const tempDiv: HTMLDivElement = getDoc().createElement("div");
    tempDiv.setCssProps({ display: "none" });
    getDoc().body.appendChild(tempDiv);

    const component: Component = new Component();

    try {
      component.load();
      await ObsidianMarkdownRenderer.render(
        this.app,
        content,
        tempDiv,
        sourcePath,
        component,
      );

      return tempDiv.innerHTML;
    } finally {
      component.unload();
      tempDiv.remove();
    }
  }
}
