import type { PluginSettings } from "../../src/types/plugin.types";
import { DEFAULT_SETTINGS } from "../../src/types/plugin.types";

export class MockNotice {
  private readonly message: string;
  constructor(message: string) {
    this.message = message;
  }

  getMessage(): string {
    return this.message;
  }
}

export class MockPlugin {
  settings: PluginSettings = { ...DEFAULT_SETTINGS };

  async loadSettings(): Promise<void> {
    return Promise.resolve();
  }

  async saveSettings(): Promise<void> {
    return Promise.resolve();
  }

  addRibbonIcon(_icon: string, _title: string, _callback: () => void): void {
    // no-op mock
  }

  addCommand(_command: {
    id: string;
    name: string;
    callback: () => void;
  }): void {
    // no-op mock
  }

  addSettingTab(_tab: unknown): void {
    // no-op mock
  }

  loadData(): Promise<Partial<PluginSettings> | undefined> {
    return Promise.resolve(undefined);
  }

  saveData(_data: PluginSettings): Promise<void> {
    return Promise.resolve();
  }
}
