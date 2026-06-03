/**
 * Port interface for the settings panel.
 *
 * Implemented by extending Obsidian's `PluginSettingTab` in the
 * infrastructure layer, rendering a native Obsidian settings UI.
 */
export interface SettingsRendererPort {
  /** Render / re-render the settings panel. */
  display(): void;
}
