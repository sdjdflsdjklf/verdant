/**
 * Port interface for rendering markdown to HTML.
 *
 * Implemented by wrapping Obsidian's `MarkdownRenderer` API,
 * which produces the same output as the editor preview.
 */
export interface MarkdownRendererPort {
  /**
   * Render markdown content to an HTML string.
   *
   * @param content - Raw markdown text.
   * @param sourcePath - Vault path of the source note (for resolving links).
   * @returns The rendered HTML string.
   */
  render(content: string, sourcePath: string): Promise<string>;
}
