import { injectable, inject } from "tsyringe";
import matter from "gray-matter";
import type { MarkdownRendererPort, LoggerPort, VaultRepositoryPort } from "../ports";
import type {
  PublishFile,
  SiteConfig,
  SiteGeneratedFile,
  GeneratedSite,
  NavItem,
  TagEntry,
  SearchIndexEntry,
} from "../../types/publisher.types";
import { DI_TOKENS } from "../../di/tokens";
import { replaceWikiLinks } from "../../shared/utils/markdown.utils";
import { ThemeRenderer } from "../../domain/theme/theme.renderer";
import type { GiscusConfig, FeedEntry } from "../../domain/theme/theme.renderer";
import { LinkGraphService, LinkGraph, RelatedNoteEntry } from "./link-graph.service";

const APP_OBSIDIAN_PREFIX = "app://obsidian.md/";

const OBSIDIAN_INTERNAL_PREFIXES: string[] = [
  "resources/",
  ".trash/",
];

const MIME_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  gif: "image/gif",
  svg: "image/svg+xml",
  webp: "image/webp",
  bmp: "image/bmp",
  ico: "image/x-icon",
};

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[<>:"/\\|?*#[\]{}()@!$&+=,;'`~%^]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function notePathToCleanUrl(relativePath: string): string {
  const base = relativePath
    .replace(/\.md$/i, "")
    .replace(/\\/g, "/")
    .split("/")
    .map((segment) => slugify(segment))
    .join("/");
  return `/${base}/`;
}

export function notePathToRepoPath(relativePath: string): string {
  const base = relativePath
    .replace(/\.md$/i, "")
    .replace(/\\/g, "/")
    .split("/")
    .map((segment) => slugify(segment))
    .join("/");
  return `${base}/index.html`;
}

function fileSlug(relativePath: string): string {
  return slugify(
    relativePath
      .replace(/\.md$/i, "")
      .replace(/\\/g, "/")
      .split("/")
      .pop() ?? relativePath,
  );
}

@injectable()
export class SiteGeneratorService {
  constructor(
    @inject(DI_TOKENS.MarkdownRenderer) private readonly renderer: MarkdownRendererPort,
    @inject(DI_TOKENS.LoggerService) private readonly logger: LoggerPort,
    @inject(DI_TOKENS.ThemeRenderer) private readonly themeRenderer: ThemeRenderer,
    @inject(DI_TOKENS.LinkGraphService) private readonly linkGraphService: LinkGraphService,
    @inject(DI_TOKENS.VaultRepository) private readonly vaultRepo: VaultRepositoryPort,
  ) {}

  public async generateFile(
    file: PublishFile,
    config: SiteConfig,
    linkGraph?: LinkGraph,
    giscusConfig?: GiscusConfig,
  ): Promise<SiteGeneratedFile> {
    const matterResult = matter(file.content);
    const fmData = matterResult.data as { title?: string; tags?: string[]; date?: string };
    const bodyContent = matterResult.content;

    const title: string = fmData.title ?? this.extractTitleFromBody(bodyContent);
    const tags: string[] = Array.isArray(fmData.tags) ? fmData.tags : [];

    const rawDate: unknown = fmData.date;
    let dateStr: string | undefined;
    if (typeof rawDate === "string" && rawDate.length > 0 && !Number.isNaN(Date.parse(rawDate))) {
      dateStr = rawDate;
    } else if (rawDate instanceof Date && !Number.isNaN(rawDate.getTime())) {
      dateStr = rawDate.toISOString();
    }

    const excerpt: string = this.buildExcerpt(bodyContent);

    const contentWithResolvedLinks = replaceWikiLinks(
      bodyContent,
      (noteName: string, _folder?: string): string => notePathToCleanUrl(noteName),
    );

    const renderedHtml: string = await this.renderer.render(
      contentWithResolvedLinks,
      file.relativePath,
    );

    const processedHtml: string = await this.processImages(renderedHtml);

    const repoPath: string = notePathToRepoPath(file.relativePath);
    const slug: string = fileSlug(file.relativePath);

    let relatedNotes: RelatedNoteEntry[] = [];
    let prevTitle: string | undefined;
    let nextTitle: string | undefined;
    let prevPath: string | undefined;
    let nextPath: string | undefined;

    if (linkGraph) {
      relatedNotes = this.linkGraphService.getRelatedNotes(slug, linkGraph);

      const sortedSlugs: string[] = Array.from(linkGraph.edges.keys()).sort();
      const prevNext = this.linkGraphService.getPrevNext(slug, linkGraph, sortedSlugs);
      if (prevNext.prev) {
        prevTitle = linkGraph.slugToTitle.get(prevNext.prev) ?? prevNext.prev;
        prevPath = linkGraph.slugToRepoPath.get(prevNext.prev) ?? `${prevNext.prev}/index.html`;
      }
      if (prevNext.next) {
        nextTitle = linkGraph.slugToTitle.get(prevNext.next) ?? prevNext.next;
        nextPath = linkGraph.slugToRepoPath.get(prevNext.next) ?? `${prevNext.next}/index.html`;
      }
    }

    const noteHtml: string = this.themeRenderer.renderNote(
      processedHtml, title, tags, dateStr, config,
      relatedNotes, giscusConfig, prevTitle, nextTitle, prevPath, nextPath,
    );

    return {
      html: noteHtml,
      relativePath: repoPath,
      title,
      tags,
      excerpt,
      date: dateStr,
    };
  }

  public async generateSite(
    files: PublishFile[],
    config: SiteConfig,
    giscusConfig?: GiscusConfig,
  ): Promise<GeneratedSite> {
    this.logger.info("Generating site with %d files", files.length);

    const linkGraph: LinkGraph = this.linkGraphService.buildGraph(files);

    const generatedFiles: SiteGeneratedFile[] = [];
    const tagMap: Map<string, TagEntry[]> = new Map();

    for (const file of files) {
      const gf = await this.generateFile(file, config, linkGraph, giscusConfig);
      generatedFiles.push(gf);

      for (const tag of gf.tags) {
        const existing: TagEntry[] = tagMap.get(tag) ?? [];
        existing.push({ title: gf.title, path: gf.relativePath });
        tagMap.set(tag, existing);
      }
    }

    const navigation: NavItem[] = generatedFiles.map((f, index) => ({
      title: f.title,
      path: f.relativePath,
      order: index,
    }));

    const tags: Record<string, TagEntry[]> = {};
    for (const [tag, tagFiles] of tagMap) {
      tags[tag] = tagFiles;
    }

    const searchIndex: SearchIndexEntry[] = generatedFiles.map((f) => ({
      title: f.title,
      path: f.relativePath,
      tags: f.tags,
      excerpt: f.excerpt,
    }));

    const indexHtml: string = this.themeRenderer.renderIndex(generatedFiles, config);

    const totalPages: number = this.themeRenderer.getTotalPages(generatedFiles.length);
    const paginatedFiles: SiteGeneratedFile[] = [];
    for (let page = 2; page <= totalPages; page++) {
      const pageHtml: string = this.themeRenderer.renderIndexPage(generatedFiles, config, page);
      paginatedFiles.push({
        html: pageHtml,
        relativePath: `page/${page}/index.html`,
        title: `Page ${page}`,
        tags: [],
        excerpt: "",
        date: undefined,
      });
    }

    const tagDetailFiles: SiteGeneratedFile[] = this.generateTagDetailFiles(tags, config);

    const allFiles: SiteGeneratedFile[] = [...generatedFiles, ...paginatedFiles, ...tagDetailFiles];

    const feedEntries: FeedEntry[] = generatedFiles
      .filter((f): f is SiteGeneratedFile & { date: string } => f.date !== undefined)
      .map((f) => ({
        title: f.title,
        slug: f.relativePath.replace(/\/index\.html$/, ""),
        date: f.date,
        excerpt: f.excerpt,
      }));

    const feedXml: string = this.themeRenderer.renderFeed(feedEntries, config);

    // Generate assets/theme.css if no custom CSS is provided
    const assetsFiles: SiteGeneratedFile[] = [];
    if ((config.customCss ?? "").length === 0) {
      const themeCss: string = this.themeRenderer.getCSS(config.themeId ?? "default");
      assetsFiles.push({
        html: themeCss,
        relativePath: "assets/theme.css",
        title: "Theme CSS",
        tags: [],
        excerpt: "",
        date: undefined,
      });
    }

    return {
      files: [...allFiles, ...assetsFiles],
      indexHtml,
      navigation,
      tags,
      searchIndex,
      feedXml,
    };
  }

  private async processImages(html: string): Promise<string> {
    const imgRegex = /<img\b[^>]*\bsrc="(app:\/\/obsidian\.md\/[^"]*)"[^>]*>/gi;
    let result: string = html;
    const replacements: Array<{ old: string; new: string }> = [];

    const matches = Array.from(html.matchAll(imgRegex));
    for (const match of matches) {
      const fullTag: string = match[0];
      const appUrl: string | undefined = match[1];
      if (!appUrl) {
        continue;
      }
      const vaultPath: string = decodeURIComponent(
        appUrl.slice(APP_OBSIDIAN_PREFIX.length),
      );

      if (this.isObsidianInternalPath(vaultPath)) {
        this.logger.debug("Skipping Obsidian internal resource: %s", vaultPath);
        replacements.push({ old: fullTag, new: "" });
        continue;
      }

      try {
        const binary: ArrayBuffer = await this.vaultRepo.readBinary(vaultPath);
        const ext: string = (vaultPath.split(".").pop() ?? "").toLowerCase();
        const mimeType: string = MIME_TYPES[ext] ?? "application/octet-stream";
        const base64: string = this.arrayBufferToBase64(binary);
        const dataUri: string = `data:${mimeType};base64,${base64}`;
        const newTag: string = fullTag.replace(appUrl, dataUri);
        replacements.push({ old: fullTag, new: newTag });
        this.logger.debug("Embedded vault image: %s", vaultPath);
      } catch {
        this.logger.warn("Failed to read vault image, removing from output: %s", vaultPath);
        replacements.push({ old: fullTag, new: "" });
      }
    }

    for (const { old: oldTag, new: newTag } of replacements) {
      result = result.split(oldTag).join(newTag);
    }

    return result;
  }

  private isObsidianInternalPath(vaultPath: string): boolean {
    return OBSIDIAN_INTERNAL_PREFIXES.some(
      (prefix: string): boolean => vaultPath.startsWith(prefix),
    );
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const CHUNK_SIZE = 4096;
    let binary = "";
    for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
      binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
    }
    return btoa(binary);
  }

  private generateTagDetailFiles(
    tags: Record<string, TagEntry[]>,
    config: SiteConfig,
  ): SiteGeneratedFile[] {
    const tagDetailFiles: SiteGeneratedFile[] = [];

    for (const [tag, tagEntries] of Object.entries(tags)) {
      const filesForTag: SiteGeneratedFile[] = tagEntries.map((entry) => {
        return { html: "", relativePath: entry.path, title: entry.title, tags: [tag], excerpt: "", date: undefined };
      });

      const tagDetailHtml = this.themeRenderer.renderTagDetail(filesForTag, tag, config);
      const tagSlug = slugify(tag);

      tagDetailFiles.push({
        html: tagDetailHtml,
        relativePath: `tags/${tagSlug}/index.html`,
        title: `Tag: ${tag}`,
        tags: [tag],
        excerpt: `${tagEntries.length} note${tagEntries.length !== 1 ? 's' : ''} with tag "${tag}"`,
        date: undefined,
      });
    }

    return tagDetailFiles;
  }

  private extractTitleFromBody(body: string): string {
    const match = body.match(/^#\s+(.+)$/m);
    return match?.[1]?.trim() ?? "Untitled";
  }

  private buildExcerpt(body: string): string {
    const cleaned: string = body
      .replace(/^---[\s\S]*?---/m, "")
      .replace(/#{1,6}\s+.*/g, "")
      .replace(/<[^>]+>/g, "")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\*\*([^*]+)\*\*/g, "$1")
      .replace(/\*([^*]+)\*/g, "$1")
      .replace(/`([^`]+)`/g, "$1")
      .trim()
      .replace(/\s+/g, " ");

    if (cleaned.length <= 200) {
      return cleaned;
    }

    return cleaned.slice(0, 197) + "...";
  }
}