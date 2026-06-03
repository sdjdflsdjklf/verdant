import { injectable, inject } from "tsyringe";
import type { LoggerPort } from "../ports";
import type { ThemeDefinition, ThemeConfig } from "../../types/theme.types";
import { ThemeRegistry } from "./theme.registry";
import { ThemeRenderer } from "./theme.renderer";
import { DI_TOKENS } from "../../di/tokens";

@injectable()
export class ThemeService {
  private activeThemeId: string = "default";
  private readonly cssCache: Map<string, string> = new Map();

  constructor(
    @inject(DI_TOKENS.ThemeRegistry) private readonly registry: ThemeRegistry,
    @inject(DI_TOKENS.ThemeRenderer) private readonly renderer: ThemeRenderer,
    @inject(DI_TOKENS.LoggerService) private readonly logger: LoggerPort,
  ) {}

  public setThemeCSS(themeId: string, css: string): void {
    this.cssCache.set(themeId, css);
  }

  public async applyTheme(themeId: string): Promise<ThemeConfig> {
    const theme = this.registry.get(themeId);
    if (!theme) {
      this.logger.error(`Cannot apply theme "${themeId}": not found`);
      throw new Error(`Theme "${themeId}" not found`);
    }
    this.activeThemeId = themeId;
    this.logger.info(`Applied theme "${themeId}"`);
    return {};
  }

  public getActiveTheme(): ThemeDefinition {
    const theme = this.registry.get(this.activeThemeId);
    if (!theme) {
      return { id: "default", name: "Default Light", description: "", isBuiltIn: true };
    }
    return theme;
  }

  public setActiveTheme(themeId: string): void {
    const theme = this.registry.get(themeId);
    if (!theme) {
      this.logger.error(`Cannot set active theme "${themeId}": not found`);
      throw new Error(`Theme "${themeId}" not found`);
    }
    this.activeThemeId = themeId;
    this.logger.info(`Active theme set to "${themeId}"`);
  }

  public async getThemeCSS(themeId: string): Promise<string> {
    const theme = this.registry.get(themeId);
    if (!theme) {
      this.logger.error(`Theme "${themeId}" not found for CSS loading`);
      throw new Error(`Theme "${themeId}" not found`);
    }
    const cached: string | undefined = this.cssCache.get(themeId);
    if (cached !== undefined) {
      return cached;
    }
    const rendererCss: string = this.renderer.getCSS(themeId);
    if (rendererCss.length > 0) {
      this.cssCache.set(themeId, rendererCss);
      return rendererCss;
    }
    this.logger.warn(`No CSS available for theme "${themeId}"`);
    return "";
  }
}
