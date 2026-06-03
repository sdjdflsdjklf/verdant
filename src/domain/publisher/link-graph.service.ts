import { injectable } from "tsyringe";
import type { PublishFile } from "../../types/publisher.types";
import { parseWikiLinks } from "../../shared/utils/markdown.utils";
import type { WikiLink } from "../../shared/utils/markdown.utils";

function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[<>:"/\\|?*#[\]{}()@!$&+=,;'`~%^]+/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
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

function notePathToRepoPath(relativePath: string): string {
  const base = relativePath
    .replace(/\.md$/i, "")
    .replace(/\\/g, "/")
    .split("/")
    .map((segment) => slugify(segment))
    .join("/");
  return `${base}/index.html`;
}

export interface LinkGraph {
  edges: Map<string, Set<string>>;
  slugToTitle: Map<string, string>;
  backlinks: Map<string, Set<string>>;
  slugToRepoPath: Map<string, string>;
}

export interface RelatedNoteEntry {
  slug: string;
  title: string;
  score: number;
  repoPath: string;
}

@injectable()
export class LinkGraphService {
  public buildGraph(notes: PublishFile[]): LinkGraph {
    const edges: Map<string, Set<string>> = new Map();
    const slugToTitle: Map<string, string> = new Map();
    const backlinks: Map<string, Set<string>> = new Map();
    const slugToRepoPath: Map<string, string> = new Map();

    const slugToFile: Map<string, PublishFile> = new Map();
    for (const note of notes) {
      const slug: string = fileSlug(note.relativePath);
      slugToFile.set(slug, note);
      slugToRepoPath.set(slug, notePathToRepoPath(note.relativePath));
    }

    const linkNameToFileSlug: Map<string, string> = new Map();
    for (const [slug, file] of slugToFile) {
      linkNameToFileSlug.set(slug, slug);
      const title: string = this.extractTitleFromContent(file.content);
      linkNameToFileSlug.set(slugify(title), slug);
    }

    for (const [slug, file] of slugToFile) {
      const wikiLinks: WikiLink[] = parseWikiLinks(file.content);
      const linkedSlugs: Set<string> = new Set();

      for (const link of wikiLinks) {
        const targetFileSlug: string | undefined = linkNameToFileSlug.get(slugify(link.name));
        if (targetFileSlug !== undefined && targetFileSlug !== slug) {
          linkedSlugs.add(targetFileSlug);
        }
      }

      edges.set(slug, linkedSlugs);
      slugToTitle.set(slug, this.extractTitleFromContent(file.content));
    }

    for (const [slug, linkedSlugs] of edges) {
      for (const target of linkedSlugs) {
        const backlinkSet: Set<string> = backlinks.get(target) ?? new Set();
        backlinkSet.add(slug);
        backlinks.set(target, backlinkSet);
      }
    }

    return { edges, slugToTitle, backlinks, slugToRepoPath };
  }

  public getRelatedNotes(
    slug: string,
    graph: LinkGraph,
    limit: number = 5,
  ): RelatedNoteEntry[] {
    const ownOutgoing: Set<string> = graph.edges.get(slug) ?? new Set();

    if (ownOutgoing.size === 0) {
      return [];
    }

    const candidates: Set<string> = new Set();
    for (const target of ownOutgoing) {
      const backlinkers: Set<string> | undefined = graph.backlinks.get(target);
      if (backlinkers !== undefined) {
        for (const backlinker of backlinkers) {
          if (backlinker !== slug) {
            candidates.add(backlinker);
          }
        }
      }
    }

    const scored: RelatedNoteEntry[] = [];
    for (const candidate of candidates) {
      const candidateOutgoing: Set<string> = graph.edges.get(candidate) ?? new Set();
      if (candidateOutgoing.size === 0) continue;

      let intersection: number = 0;
      for (const link of ownOutgoing) {
        if (candidateOutgoing.has(link)) {
          intersection++;
        }
      }
      const union: number = ownOutgoing.size + candidateOutgoing.size - intersection;
      const jaccard: number = intersection / union;

      if (jaccard > 0) {
        scored.push({
          slug: candidate,
          title: graph.slugToTitle.get(candidate) ?? candidate,
          score: jaccard,
          repoPath: graph.slugToRepoPath.get(candidate) ?? `${candidate}/index.html`,
        });
      }
    }

    scored.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
    return scored.slice(0, limit);
  }

  public getPrevNext(
    slug: string,
    _graph: LinkGraph,
    sortedFileSlugs: string[],
  ): { prev?: string; next?: string } {
    const idx: number = sortedFileSlugs.indexOf(slug);
    if (idx === -1) {
      return {};
    }

    const prev: string | undefined = idx > 0 ? sortedFileSlugs[idx - 1] : undefined;
    const next: string | undefined = idx < sortedFileSlugs.length - 1 ? sortedFileSlugs[idx + 1] : undefined;

    return { prev, next };
  }

  private extractTitleFromContent(content: string): string {
    const frontmatterMatch: RegExpMatchArray | null = content.match(
      /^---\s*\ntitle:\s*(.+)\s*\n/,
    );
    if (frontmatterMatch?.[1]) {
      const raw: string = frontmatterMatch[1].trim();
      return raw.replace(/^['"]|['"]$/g, "");
    }

    const h1Match: RegExpMatchArray | null = content.match(/^#\s+(.+)$/m);
    return h1Match?.[1]?.trim() ?? "Untitled";
  }
}