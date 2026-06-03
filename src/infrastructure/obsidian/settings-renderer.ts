import { injectable } from "tsyringe";
import type { SettingsRendererPort } from "../../domain/ports/settings-renderer.port";

/**
 * Stub implementation of {@link SettingsRendererPort}.
 *
 * The real implementation will extend Obsidian's `PluginSettingTab`
 * and will be built in Phase 8 (Presentation layer).
 */
@injectable()
export class SettingsRenderer implements SettingsRendererPort {
  public display(): void {
    // Will be implemented in Phase 8
  }
}
