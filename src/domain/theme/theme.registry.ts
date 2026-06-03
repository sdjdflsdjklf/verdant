import { injectable, inject } from "tsyringe";
import type { LoggerPort } from "../ports";
import type { ThemeDefinition } from "../../types/theme.types";
import { BUILT_IN_THEMES } from "../../types/theme.types";
import { DI_TOKENS } from "../../di/tokens";

@injectable()
export class ThemeRegistry {
  private readonly themes: Map<string, ThemeDefinition> = new Map();

  constructor(
    @inject(DI_TOKENS.LoggerService) private readonly logger: LoggerPort,
  ) {
    this.registerBuiltIn();
  }

  public register(theme: ThemeDefinition): void {
    if (this.themes.has(theme.id)) {
      this.logger.warn(`Theme "${theme.id}" is already registered. Skipping duplicate.`);
      return;
    }
    this.themes.set(theme.id, theme);
  }

  public get(id: string): ThemeDefinition | undefined {
    return this.themes.get(id);
  }

  public list(): ThemeDefinition[] {
    return Array.from(this.themes.values());
  }

  public getBuiltIn(): ThemeDefinition[] {
    return Array.from(this.themes.values()).filter((t) => t.isBuiltIn);
  }

  private registerBuiltIn(): void {
    for (const theme of BUILT_IN_THEMES) {
      this.themes.set(theme.id, theme);
    }
  }
}
