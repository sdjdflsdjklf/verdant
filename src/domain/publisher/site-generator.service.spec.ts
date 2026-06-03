import type { MarkdownRendererPort, LoggerPort, VaultRepositoryPort } from "../ports";
import type { PublishFile, SiteConfig, SiteGeneratedFile, GeneratedSite } from "../../types/publisher.types";
import { SiteGeneratorService } from "./site-generator.service";
import type { ThemeRenderer } from "../../domain/theme/theme.renderer";
import type { LinkGraphService } from "./link-graph.service";

describe("SiteGeneratorService", (): void => {
  let mockRenderer: jest.Mocked<MarkdownRendererPort>;
  let mockLogger: jest.Mocked<LoggerPort>;
  let mockVaultRepo: jest.Mocked<VaultRepositoryPort>;
  let mockThemeRenderer: jest.Mocked<ThemeRenderer>;
  let mockLinkGraphService: jest.Mocked<LinkGraphService>;
  let service: SiteGeneratorService;
  let defaultConfig: SiteConfig;

  const sampleMarkdown = `---
title: Test Note
tags: [dev, testing]
date: 2026-01-15
---
# Hello World

This is a [[Wiki Link]] test.

Some content here for excerpt.`;

  const samplePublishFile: PublishFile = {
    relativePath: "notes/test-note.md",
    absolutePath: "/vault/notes/test-note.md",
    content: sampleMarkdown,
    hash: "abc123",
    mtime: 1716000000000,
  };

  beforeEach((): void => {
    mockRenderer = {
      render: jest.fn().mockResolvedValue("<p>Rendered HTML</p>"),
    };

    mockVaultRepo = {
      readFile: jest.fn(),
      readBinary: jest.fn(),
      exists: jest.fn(),
      listMarkdownFiles: jest.fn(),
      getPublishFile: jest.fn(),
    };

    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      setLevel: jest.fn(),
    };

    mockThemeRenderer = {
      getCSS: jest.fn().mockReturnValue(""),
      renderIndex: jest.fn().mockImplementation((files: SiteGeneratedFile[], config: SiteConfig): string => {
        const title = config.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const links = files.map((f) => `<a href="${f.relativePath}">${f.title}</a>`).join("\n");
        return `<!DOCTYPE html><html><head><title>${title}</title></head><body><h1>${title}</h1>${links}<p class="garden-note-count">${files.length} notes</p></body></html>`;
      }),
      renderIndexPage: jest.fn().mockImplementation((_files: SiteGeneratedFile[], config: SiteConfig, page: number): string => {
        const title = config.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<!DOCTYPE html><html><head><title>${title} - Page ${page}</title></head><body><h1>${title}</h1><p>Page ${page}</p></body></html>`;
      }),
      getTotalPages: jest.fn().mockReturnValue(1),
      getFlexSearchBundle: jest.fn().mockReturnValue(""),
      renderNote: jest.fn().mockImplementation((html: string, title: string, _tags: string[], _date: string | undefined, config: SiteConfig): string => {
        const escapedTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const siteTitle = config.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        return `<!DOCTYPE html><html><head><title>${escapedTitle} — ${siteTitle}</title></head><body><h1>${escapedTitle}</h1>${html}<footer>${siteTitle}</footer></body></html>`;
      }),
      renderTags: jest.fn().mockReturnValue("<!DOCTYPE html><html><head><title>Tags</title></head><body><h1>Tags</h1></body></html>"),
      renderTagDetail: jest.fn().mockReturnValue("<!DOCTYPE html><html><head><title>Tag Detail</title></head><body><h1>Tag Detail</h1></body></html>"),
      renderFeed: jest.fn().mockReturnValue('<?xml version="1.0"?><feed><title>Feed</title></feed>'),
      buildTocHtml: jest.fn().mockReturnValue(""),
      buildRelatedNotesHtml: jest.fn().mockReturnValue(""),
      buildCommentsHtml: jest.fn().mockReturnValue(""),
    } as unknown as jest.Mocked<ThemeRenderer>;

    mockLinkGraphService = {
      buildGraph: jest.fn().mockReturnValue({
        edges: new Map(),
        slugToTitle: new Map(),
        backlinks: new Map(),
      }),
      getRelatedNotes: jest.fn().mockReturnValue([]),
      getPrevNext: jest.fn().mockReturnValue({}),
    } as unknown as jest.Mocked<LinkGraphService>;

    service = new SiteGeneratorService(mockRenderer, mockLogger, mockThemeRenderer, mockLinkGraphService, mockVaultRepo);

    defaultConfig = {
      title: "My Garden",
      description: "A digital garden",
      baseUrl: "https://user.github.io/garden",
      themeId: "default",
      githubToken: "ghp_test",
      githubOwner: "user",
      githubRepo: "garden",
    };
  });

  describe("generateFile", (): void => {
    it("should generate HTML from a publish file", async (): Promise<void> => {
      const result: SiteGeneratedFile = await service.generateFile(
        samplePublishFile,
        defaultConfig,
      );

      expect(result).toBeDefined();
      expect(result.title).toBe("Test Note");
      expect(result.tags).toEqual(["dev", "testing"]);
      expect(result.relativePath).toBe("notes/test-note/index.html");
      expect(result.html).toContain("<!DOCTYPE html>");
      expect(result.html).toContain("My Garden");
      expect(result.html).toContain("Rendered HTML");
      expect(result.date).toBeDefined();
    });

    it("should convert WikiLinks to anchor tags", async (): Promise<void> => {
      await service.generateFile(samplePublishFile, defaultConfig);

      expect(mockRenderer.render).toHaveBeenCalledWith(
        expect.stringContaining('/wiki-link/'),
        "notes/test-note.md",
      );
    });

    it("should handle file without frontmatter", async (): Promise<void> => {
      const file: PublishFile = {
        ...samplePublishFile,
        content: "# Just a Title\n\nSome body content.",
      };

      const result: SiteGeneratedFile = await service.generateFile(file, defaultConfig);

      expect(result.title).toBe("Just a Title");
      expect(result.tags).toEqual([]);
      expect(result.date).toBeUndefined();
    });

    it("should escape HTML in title", async (): Promise<void> => {
      const file: PublishFile = {
        ...samplePublishFile,
        content: `---\ntitle: '<script>alert("xss")</script>'\n---\n\nContent`,
      };

      const result: SiteGeneratedFile = await service.generateFile(file, defaultConfig);

      expect(result.html).not.toContain("<script>");
      expect(result.html).toContain("&lt;script&gt;");
    });

    it("should render markdown via the renderer", async (): Promise<void> => {
      mockRenderer.render.mockResolvedValue("<p>Custom HTML</p>");

      const result: SiteGeneratedFile = await service.generateFile(
        samplePublishFile,
        defaultConfig,
      );

      expect(result.html).toContain("Custom HTML");
      expect(mockRenderer.render).toHaveBeenCalledTimes(1);
    });
  });

  describe("generateSite", (): void => {
    it("should generate a complete site from multiple files", async (): Promise<void> => {
      const file1: PublishFile = {
        ...samplePublishFile,
        relativePath: "notes/note-one.md",
        content: `---\ntitle: Note One\ntags: [dev]\n---\n\nFirst note.`,
      };

      const file2: PublishFile = {
        ...samplePublishFile,
        relativePath: "notes/note-two.md",
        content: `---\ntitle: Note Two\ntags: [testing]\n---\n\nSecond note.`,
      };

const result: GeneratedSite = await service.generateSite(
        [file1, file2],
        defaultConfig,
      );

      expect(result.files).toHaveLength(4);
      expect(result.navigation).toHaveLength(2);
      expect(result.navigation[0]?.title).toBe("Note One");
      expect(result.tags["dev"]).toBeDefined();
      expect(result.tags["testing"]).toBeDefined();
      expect(result.searchIndex).toHaveLength(2);
      expect(result.indexHtml).toContain("Note One");
      expect(result.indexHtml).toContain("Note Two");
    });

    it("should log generation info", async (): Promise<void> => {
      await service.generateSite([samplePublishFile], defaultConfig);

      expect(mockLogger.info).toHaveBeenCalledWith(
        expect.stringContaining("Generating site"),
        expect.any(Number),
      );
    });
  });

  describe("generateFile edge cases", (): void => {
    it("should handle untitled files", async (): Promise<void> => {
      const file: PublishFile = {
        ...samplePublishFile,
        content: "Just body text, no title.",
      };

      const result: SiteGeneratedFile = await service.generateFile(file, defaultConfig);

      expect(result.title).toBe("Untitled");
    });

    it("should handle non-array tags", async (): Promise<void> => {
      const file: PublishFile = {
        ...samplePublishFile,
        content: `---\ntitle: Tags Test\ntags: "string"\n---\n\nContent`,
      };

      const result: SiteGeneratedFile = await service.generateFile(file, defaultConfig);

      expect(result.tags).toEqual([]);
    });

    it("should handle long content for excerpt", async (): Promise<void> => {
      const longBody: string = "A".repeat(500);
      const file: PublishFile = {
        ...samplePublishFile,
        content: `---\ntitle: Long\n---\n\n${longBody}`,
      };

      const result: SiteGeneratedFile = await service.generateFile(file, defaultConfig);

      // Excerpt should be truncated to ~200 chars
      expect(result.excerpt.length).toBeLessThanOrEqual(203);
      expect(result.excerpt).toContain("...");
    });

    it("should handle invalid date gracefully", async (): Promise<void> => {
      const file: PublishFile = {
        ...samplePublishFile,
        content: `---\ntitle: Date Test\ndate: not-a-date\n---\n\nContent`,
      };

      const result: SiteGeneratedFile = await service.generateFile(file, defaultConfig);

      expect(result.date).toBeUndefined();
    });
  });

  describe("generateIndexHtml", (): void => {
    it("should generate valid index HTML with note links", async (): Promise<void> => {
      const file: PublishFile = {
        ...samplePublishFile,
        content: `---\ntitle: Indexed Note\n---\n\nContent`,
      };

      const result: GeneratedSite = await service.generateSite(
        [file],
        defaultConfig,
      );

      expect(result.indexHtml).toContain("<!DOCTYPE html>");
      expect(result.indexHtml).toContain("My Garden");
      expect(result.indexHtml).toContain("Indexed Note");
      expect(result.indexHtml).toContain('<a href="');
    });
  });
});
