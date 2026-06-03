/**
 * Plugin settings persisted to Obsidian's PluginData store.
 */
export interface PluginSettings {
  /** GitHub Personal Access Token */
  githubToken: string;

  /** GitHub username / owner */
  githubUsername: string;

  /** Target repository name (e.g. "my-garden-site") */
  repoName: string;

  /** Branch used for GitHub Pages (default "gh-pages") */
  publishBranch: string;

  /** Site title */
  siteTitle: string;

  /** Site description (for SEO) */
  siteDescription: string;

  /** Selected theme ID */
  themeId: string;

  /** Last published timestamp (ISO string) */
  lastPublished: string;

  /** Notes selected for publishing (relative paths) */
  selectedNotes: string[];
}

/** Default plugin settings */
export const DEFAULT_SETTINGS: PluginSettings = {
  githubToken: "",
  githubUsername: "",
  repoName: "my-garden-site",
  publishBranch: "gh-pages",
  siteTitle: "My Digital Garden",
  siteDescription: "A digital garden powered by Garden",
  themeId: "default",
  lastPublished: "",
  selectedNotes: [],
};
