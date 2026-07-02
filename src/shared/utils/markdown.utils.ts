import matter from "gray-matter";

const WIKI_LINK_REGEX =
  /\[\[(?:([^\]|#]+?)\/)?([^\]|#]+)(?:#([^\]|]*))?(?:\|([^\]|]+))?\]\]/g;

export interface ParsedFrontmatter {
  title?: string;
  tags?: string[];
  date?: Date;
  [key: string]: unknown;
}

export interface WikiLink {
  name: string;
  folder?: string;
  alias?: string;
}

export function parseFrontmatter(content: string): ParsedFrontmatter {
  const parsed = matter(content);
  const data = parsed.data as Record<string, unknown>;

  const result: ParsedFrontmatter = {};

  if (typeof data.title === "string") {
    result.title = data.title;
  }
  if (Array.isArray(data.tags)) {
    result.tags = data.tags.filter(
      (t: unknown): t is string => typeof t === "string",
    );
  }
  if (data.date instanceof Date && !Number.isNaN(data.date.getTime())) {
    result.date = data.date;
  } else if (typeof data.date === "string" || typeof data.date === "number") {
    const parsedDate = new Date(data.date);
    if (!Number.isNaN(parsedDate.getTime())) {
      result.date = parsedDate;
    }
  }

  for (const [key, value] of Object.entries(data)) {
    if (!["title", "tags", "date"].includes(key)) {
      result[key] = value;
    }
  }

  return result;
}

export function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match?.[1]?.trim() ?? "";
}

export function parseWikiLinks(content: string): WikiLink[] {
  const links: WikiLink[] = [];
  const seen = new Set<string>();
  let match: RegExpExecArray | null;

  while ((match = WIKI_LINK_REGEX.exec(content)) !== null) {
    const noteName: string | undefined = match[2]?.trim();
    if (!noteName) continue;

    const key = noteName.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const folder: string | undefined = match[1]?.trim() || undefined;
    const alias: string | undefined = match[4]?.trim() || undefined;

    links.push({ name: noteName, folder, alias });
  }

  return links;
}

function escapeMarkdownLinkText(str: string): string {
  return str.replace(/\\/g, "\\\\").replace(/\]/g, "\\]").replace(/\[/g, "\\[");
}

export function replaceWikiLinks(
  content: string,
  resolvePath: (noteName: string, folder?: string) => string,
): string {
  return content.replace(
    WIKI_LINK_REGEX,
    (_match, folder: string | undefined, noteName: string, heading: string | undefined, alias: string | undefined) => {
      const name = noteName.trim();
      const folderPath: string | undefined = folder?.trim() || undefined;
      const label = escapeMarkdownLinkText(alias?.trim() ?? name);
      let href = resolvePath(name, folderPath);
      if (heading !== undefined && heading.trim().length > 0) {
        href += `#${heading.trim()}`;
      }
      return `[${label}](<${href}>)`;
    },
  );
}