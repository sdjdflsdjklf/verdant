export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  isBuiltIn: boolean;
  previewPath?: string;
  cssPath?: string;
  templatePath?: string;
}

export interface GeneratedFile {
  title: string;
  path: string;
  date?: string;
  tags?: string[];
}

export interface ThemeConfig {
  cssVars?: Record<string, string>;
  additionalStyles?: string[];
}

export const BUILT_IN_THEMES: ThemeDefinition[] = [
  {
    id: "default",
    name: "Default Light",
    description: "Clean, minimal light theme",
    isBuiltIn: true,
  },
  {
    id: "dark",
    name: "Dark Mode",
    description: "Easy-on-the-eyes dark theme",
    isBuiltIn: true,
  },
];
