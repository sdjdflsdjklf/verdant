/**
 * Publish mode — full re-publish or incremental (changed files only).
 */
export type PublishMode = "full" | "incremental";

/**
 * Progress status for the publish pipeline.
 */
export type PublishStep =
  | "idle"
  | "scanning"
  | "generating"
  | "pushing"
  | "deploying"
  | "done"
  | "error";

export interface PublishProgress {
  step: PublishStep;
  /** 0–100 percentage */
  percent: number;
  /** Human-readable status message */
  message: string;
}

export interface PublishResult {
  success: boolean;
  /** Deployed site URL (e.g. https://user.github.io/repo/) */
  siteUrl?: string;
  /** Number of notes published */
  notesPublished: number;
  /** Elapsed time in ms */
  elapsedMs: number;
  /** Error message if failed */
  error?: string;
  /** Whether this was an incremental publish */
  wasIncremental: boolean;
}

export interface PublishFile {
  /** Relative path within vault (e.g. "notes/my-page.md") */
  relativePath: string;
  /** Absolute path in vault */
  absolutePath: string;
  /** File content as string */
  content: string;
  /** SHA256 hash of content */
  hash: string;
  /** File last modified timestamp (ms) */
  mtime: number;
}

export interface SiteConfig {
  title: string;
  description: string;
  baseUrl: string;
  themeId: string;
  githubToken: string;
  githubOwner: string;
  githubRepo: string;
  githubBranch?: string;
  isPro?: boolean;
  customCss?: string;
}

export interface SiteGeneratedFile {
  html: string;
  relativePath: string;
  title: string;
  tags: string[];
  excerpt: string;
  date?: string;
}

export interface NavItem {
  title: string;
  path: string;
  order: number;
}

export interface TagEntry {
  title: string;
  path: string;
}

export interface SearchIndexEntry {
  title: string;
  path: string;
  tags: string[];
  excerpt: string;
}

export interface GeneratedSite {
  files: SiteGeneratedFile[];
  navigation: NavItem[];
  tags: Record<string, TagEntry[]>;
  searchIndex: SearchIndexEntry[];
  indexHtml: string;
  feedXml?: string;
}

export interface FileDiff {
  added: PublishFile[];
  modified: PublishFile[];
  deleted: string[];
  unchanged: string[];
}
