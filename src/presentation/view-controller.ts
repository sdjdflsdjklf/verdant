import { injectable, singleton, inject } from "tsyringe";
import { type Plugin, type WorkspaceLeaf } from "obsidian";
import { DI_TOKENS } from "../di/tokens";
import type { LoggerPort } from "../domain/ports";
import {
  NoteSelectorView,
  VIEW_TYPE_NOTE_SELECTOR,
} from "./components/note-selector.view";
import { PublishWizardView } from "./components/publish-wizard.view";

@singleton()
@injectable()
export class ViewController {
  constructor(
    @inject(DI_TOKENS.LoggerService) private readonly logger: LoggerPort,
  ) {}

  public registerViews(plugin: Plugin): void {
    plugin.registerView(
      VIEW_TYPE_NOTE_SELECTOR,
      (leaf: WorkspaceLeaf) => {
        const view = new NoteSelectorView(leaf, plugin);
        view.onPublishRequest = (): void => {
          this.openPublishModal(plugin);
        };
        return view;
      },
    );
    this.logger.info("Views registered");
  }

  public async activateNoteSelector(plugin: Plugin): Promise<void> {
    const { workspace } = plugin.app;
    const existingLeaves: WorkspaceLeaf[] = workspace.getLeavesOfType(
      VIEW_TYPE_NOTE_SELECTOR,
    );
    const leaf: WorkspaceLeaf | undefined = existingLeaves[0];

    if (leaf !== undefined) {
      void workspace.revealLeaf(leaf);
      return;
    }

    const newLeaf: WorkspaceLeaf | null = workspace.getRightLeaf(false);
    if (newLeaf !== null) {
      await newLeaf.setViewState({
        type: VIEW_TYPE_NOTE_SELECTOR,
        active: true,
      });
      void workspace.revealLeaf(newLeaf);
    }
  }

  public openPublishModal(plugin: Plugin): void {
    try {
      const modal = new PublishWizardView(plugin.app);
      modal.open();
    } catch (error: unknown) {
      const msg: string = error instanceof Error ? error.message : String(error);
      this.logger.error("Failed to open publish modal: %s", msg);
    }
  }
}
