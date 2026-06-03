import {
  parseFrontmatter,
  extractTitle,
  parseWikiLinks,
  replaceWikiLinks,
} from "./markdown.utils";
import type { WikiLink } from "./markdown.utils";

describe("markdown.utils", (): void => {
  describe("parseFrontmatter", (): void => {
    it("should parse title, tags, and date from frontmatter", (): void => {
      const content = `---
title: My Note
tags: [dev, typescript]
date: 2026-05-18
---
# Content here`;

      const result = parseFrontmatter(content);
      expect(result.title).toBe("My Note");
      expect(result.tags).toEqual(["dev", "typescript"]);
      expect(result.date).toBeInstanceOf(Date);
      expect((result.date as Date).toISOString()).toContain("2026-05-18");
    });

    it("should return empty object for content without frontmatter", (): void => {
      const result = parseFrontmatter("# Just content");
      expect(result.title).toBeUndefined();
      expect(result.tags).toBeUndefined();
    });

    it("should handle string date", (): void => {
      const content = `---
date: 2026-01-01
---`;
      const result = parseFrontmatter(content);
      expect(result.date).toBeInstanceOf(Date);
    });

    it("should ignore non-string titles", (): void => {
      const content = `---
title: 42
---`;
      const result = parseFrontmatter(content);
      expect(result.title).toBeUndefined();
    });

    it("should filter non-string tags", (): void => {
      const content = `---
tags: [valid, 42, true]
---`;
      const result = parseFrontmatter(content);
      expect(result.tags).toEqual(["valid"]);
    });

    it("should handle string date that fails to parse", (): void => {
      const content = `---
date: definitely-not-a-date
---`;
      const result = parseFrontmatter(content);
      expect(result.date).toBeUndefined();
    });

    it("should pass through custom frontmatter fields", (): void => {
      const content = `---
customField: hello
nested:
  key: value
---`;
      const result = parseFrontmatter(content);
      expect(result.customField).toBe("hello");
      expect((result.nested as Record<string, string>).key).toBe("value");
    });

    it("should handle numeric date (Unix timestamp)", (): void => {
      const content = `---
date: 1716000000000
---`;
      const result = parseFrontmatter(content);
      expect(result.date).toBeInstanceOf(Date);
      expect((result.date as Date).getTime()).toBe(1716000000000);
    });
  });

  describe("extractTitle", (): void => {
    it("should extract first H1 heading", (): void => {
      expect(extractTitle("# Hello World\n\nSome text")).toBe("Hello World");
    });

    it("should return empty string if no H1", (): void => {
      expect(extractTitle("## Subheading\n\nContent")).toBe("");
    });

    it("should return empty string for empty input", (): void => {
      expect(extractTitle("")).toBe("");
    });
  });

  describe("parseWikiLinks", (): void => {
    it("should find all WikiLinks in content", (): void => {
      const content = "See [[Note One]] and [[Note Two]] for details.";
      const links: WikiLink[] = parseWikiLinks(content);
      expect(links).toHaveLength(2);
      expect(links[0]?.name).toBe("Note One");
      expect(links[1]?.name).toBe("Note Two");
    });

    it("should handle aliased WikiLinks", (): void => {
      const content = "Read [[Long Note Name|short]].";
      const links: WikiLink[] = parseWikiLinks(content);
      expect(links).toHaveLength(1);
      expect(links[0]?.name).toBe("Long Note Name");
      expect(links[0]?.alias).toBe("short");
    });

    it("should return unique links only", (): void => {
      const content = "[[Same]] and [[Same]] again.";
      const links: WikiLink[] = parseWikiLinks(content);
      expect(links).toHaveLength(1);
      expect(links[0]?.name).toBe("Same");
    });

    it("should return empty array if no links", (): void => {
      expect(parseWikiLinks("No links here.")).toEqual([]);
    });

    it("should skip whitespace-only wiki link names", (): void => {
      const content = "See [[ ]] and [[  |alias]].";
      const links: WikiLink[] = parseWikiLinks(content);
      expect(links).toEqual([]);
    });

    it("should parse folder path from WikiLink", (): void => {
      const content = "See [[projects/My Project]] for more.";
      const links: WikiLink[] = parseWikiLinks(content);
      expect(links).toHaveLength(1);
      expect(links[0]?.name).toBe("My Project");
      expect(links[0]?.folder).toBe("projects");
    });

    it("should parse folder and alias together", (): void => {
      const content = "See [[projects/My Project|proj]] for more.";
      const links: WikiLink[] = parseWikiLinks(content);
      expect(links).toHaveLength(1);
      expect(links[0]?.name).toBe("My Project");
      expect(links[0]?.folder).toBe("projects");
      expect(links[0]?.alias).toBe("proj");
    });
  });

  describe("replaceWikiLinks", (): void => {
    it("should replace WikiLinks with anchor tags", (): void => {
      const content = "See [[My Note]].";
      const result = replaceWikiLinks(content, (name: string, _folder?: string): string => `/notes/${name.toLowerCase().replace(/\s+/g, "-")}`);
      expect(result).toBe('See <a href="/notes/my-note">My Note</a>.');
    });

    it("should use alias as display text", (): void => {
      const content = "See [[Really Long Name|short]].";
      const result = replaceWikiLinks(content, (name: string, _folder?: string): string => `/notes/${name.toLowerCase().replace(/\s+/g, "-")}`);
      expect(result).toBe('See <a href="/notes/really-long-name">short</a>.');
    });

    it("should handle empty resolve function gracefully", (): void => {
      const content = "[[Test]]";
      const result = replaceWikiLinks(content, (): string => "#");
      expect(result).toBe('<a href="#">Test</a>');
    });

    it("should include folder path in href when folder exists", (): void => {
      const content = "See [[projects/My Project]].";
      const result = replaceWikiLinks(content, (name: string, folder?: string): string => {
        const prefix = folder ? `${folder}/` : "";
        return `/${prefix}${name.toLowerCase().replace(/\s+/g, "-")}.html`;
      });
      expect(result).toBe('See <a href="/projects/my-project.html">My Project</a>.');
    });

    it("should not include folder when not present", (): void => {
      const content = "See [[My Note]].";
      const result = replaceWikiLinks(content, (name: string, folder?: string): string => {
        const prefix = folder ? `${folder}/` : "";
        return `/${prefix}${name.toLowerCase().replace(/\s+/g, "-")}.html`;
      });
      expect(result).toBe('See <a href="/my-note.html">My Note</a>.');
    });

    it("should handle folder and alias together", (): void => {
      const content = "See [[projects/My Project|proj]].";
      const result = replaceWikiLinks(content, (name: string, folder?: string): string => {
        const prefix = folder ? `${folder}/` : "";
        return `/${prefix}${name.toLowerCase().replace(/\s+/g, "-")}.html`;
      });
      expect(result).toBe('See <a href="/projects/my-project.html">proj</a>.');
    });
  });
});