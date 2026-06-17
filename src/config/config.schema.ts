import type { PluginSettings } from "../types/plugin.types";

/**
 * Configuration schema — describes each setting field.
 * Used for validation and documentation.
 */
export interface ConfigFieldDescriptor<T = unknown> {
  key: keyof PluginSettings;
  label: string;
  description: string;
  type: "string" | "number" | "boolean" | "string[]";
  defaultValue: T;
  required: boolean;
  sensitive?: boolean;
}

/**
 * Full schema definition for PluginSettings.
 * One entry per field.
 */
export const CONFIG_SCHEMA: ConfigFieldDescriptor[] = [
  { key: "githubToken", label: "GitHub Token", description: "Personal Access Token with repo scope", type: "string", defaultValue: "", required: true, sensitive: true },
  { key: "githubUsername", label: "GitHub Username", description: "Your GitHub username/organization", type: "string", defaultValue: "", required: true },
  { key: "repoName", label: "Repository Name", description: "Target GitHub repository", type: "string", defaultValue: "my-garden-site", required: true },
  { key: "publishBranch", label: "Publish Branch", description: "Branch for GitHub Pages", type: "string", defaultValue: "gh-pages", required: false },
  { key: "siteTitle", label: "Site Title", description: "Your site's title", type: "string", defaultValue: "My Verdant Site", required: false },
  { key: "siteDescription", label: "Site Description", description: "SEO description", type: "string", defaultValue: "A verdant site powered by Verdant", required: false },
  { key: "themeId", label: "Theme", description: "Site theme", type: "string", defaultValue: "default", required: false },
  { key: "lastPublished", label: "Last Published", description: "ISO timestamp of last publish", type: "string", defaultValue: "", required: false },
  { key: "selectedNotes", label: "Selected Notes", description: "Notes selected for publishing", type: "string[]", defaultValue: [], required: false },
];
