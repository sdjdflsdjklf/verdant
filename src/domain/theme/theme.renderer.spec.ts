import { ThemeRenderer, GiscusConfig } from "./theme.renderer";
import type { SiteConfig, SiteGeneratedFile, TagEntry } from "../../types/publisher.types";
import type { RelatedNoteEntry } from "../publisher/link-graph.service";

describe("ThemeRenderer", (): void => {
  let renderer: ThemeRenderer;
  let defaultConfig: SiteConfig;

  beforeEach((): void => {
    renderer = new ThemeRenderer();

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

  describe("getCSS", (): void => {
    it("should return CSS for default theme", (): void => {
      const css: string = renderer.getCSS("default");
      expect(css).toContain(":root");
      expect(css).toContain("--bg:");
    });

    it("should return CSS for dark theme", (): void => {
      const css: string = renderer.getCSS("dark");
      expect(css).toContain(":root");
      expect(css).toContain("--bg: #0c0a09");
    });

    it("should return default CSS for unknown theme", (): void => {
      const css: string = renderer.getCSS("unknown");
      expect(css).toContain(":root");
    });
  });

  describe("renderIndex", (): void => {
    it("should generate an index page with note cards", (): void => {
      const files: SiteGeneratedFile[] = [
        {
          html: "<p>Content 1</p>",
          relativePath: "notes/note1/index.html",
          title: "Note 1",
          tags: ["tag1"],
          excerpt: "Excerpt 1",
          date: "2026-01-01",
        },
        {
          html: "<p>Content 2</p>",
          relativePath: "notes/note2/index.html",
          title: "Note 2",
          tags: ["tag2"],
          excerpt: "Excerpt 2",
          date: undefined,
        },
      ];

      const html: string = renderer.renderIndex(files, defaultConfig);
      expect(html).toContain("My Garden");
      expect(html).toContain("A digital garden");
      expect(html).toContain("Note 1");
      expect(html).toContain("Note 2");
      expect(html).toContain("garden-card");
    });

    it("should handle empty file list", (): void => {
      const html: string = renderer.renderIndex([], defaultConfig);
      expect(html).toContain("My Garden");
      expect(html).toContain("garden-card-grid");
    });

    it("should render Free search input without Pro class", (): void => {
      const html: string = renderer.renderIndex([], defaultConfig);
      expect(html).toContain('class="garden-search-input"');
      expect(html).toContain('placeholder="Search notes..."');
      expect(html).not.toContain("garden-search-results");
      expect(html).not.toContain("cdn.jsdelivr.net/npm/flexsearch");
      expect(html).not.toContain("flexsearch.bundle.js");
      expect(html).not.toContain("FlexSearch");
    });

    it("should render Pro search with flexsearch when isPro is true", (): void => {
      const proConfig: SiteConfig = { ...defaultConfig, isPro: true };
      const html: string = renderer.renderIndex([], proConfig);
      expect(html).toContain("garden-search-pro");
      expect(html).toContain("Search all notes");
      expect(html).toContain("flexsearch");
      expect(html).toContain("garden-search-results");
      expect(html).toContain("search.json");
    });

    it("should not include flexsearch script for Free users", (): void => {
      const html: string = renderer.renderIndex([], defaultConfig);
      expect(html).not.toContain("flexsearch.bundle.js");
      expect(html).not.toContain("FlexSearch");
    });

    it("should include flexsearch local asset and search script for Pro users", (): void => {
      const proConfig: SiteConfig = { ...defaultConfig, isPro: true };
      const html: string = renderer.renderIndex([], proConfig);
      expect(html).toContain("flexsearch.bundle.js");
      expect(html).toContain("FlexSearch.Document");
    });

    it("should include search results container for Pro users", (): void => {
      const proConfig: SiteConfig = { ...defaultConfig, isPro: true };
      const html: string = renderer.renderIndex([], proConfig);
      expect(html).toContain('id="garden-search-results"');
    });

    it("should not include search results container for Free users", (): void => {
      const html: string = renderer.renderIndex([], defaultConfig);
      expect(html).not.toContain("garden-search-results");
    });
  });

  describe("renderNote", (): void => {
    it("should generate a note page with rendered content", (): void => {
      const html: string = renderer.renderNote(
        "<p>Rendered HTML</p>",
        "Test Note",
        ["dev", "testing"],
        "2026-01-15",
        defaultConfig,
      );

      expect(html).toContain("Test Note");
      expect(html).toContain("Rendered HTML");
      expect(html).toContain("dev");
      expect(html).toContain("testing");
      expect(html).toContain("garden-tag");
    });

    it("should handle note without date", (): void => {
      const html: string = renderer.renderNote(
        "<p>Content</p>",
        "Untitled",
        [],
        undefined,
        defaultConfig,
      );

      expect(html).toContain("Untitled");
      expect(html).toContain("Content");
    });

    it("should include related notes HTML when provided", (): void => {
      const relatedNotes: RelatedNoteEntry[] = [
        { slug: "note-b", title: "Note B", score: 0.5, repoPath: "notes/note-b/index.html" },
        { slug: "note-c", title: "Note C", score: 0.3, repoPath: "notes/note-c/index.html" },
      ];

      const html: string = renderer.renderNote(
        "<p>Content</p>",
        "Note A",
        [],
        undefined,
        defaultConfig,
        relatedNotes,
      );

      expect(html).toContain("Related Notes");
      expect(html).toContain("Note B");
      expect(html).toContain("Note C");
      expect(html).toContain("garden-related");
    });

    it("should include giscus comments when config provided", (): void => {
      const giscusConfig: GiscusConfig = {
        repo: "user/repo",
        repoId: "R_123",
        category: "Comments",
        categoryId: "C_456",
      };

      const html: string = renderer.renderNote(
        "<p>Content</p>",
        "Note A",
        [],
        undefined,
        defaultConfig,
        [],
        giscusConfig,
      );

      expect(html).toContain("Comments");
      expect(html).toContain("giscus.app");
      expect(html).toContain("user/repo");
    });

    it("should generate TOC for content with multiple headings", (): void => {
      const html: string = renderer.renderNote(
        "<h2>Section 1</h2><p>A</p><h2>Section 2</h2><p>B</p>",
        "Note",
        [],
        undefined,
        defaultConfig,
      );

      expect(html).toContain("Section 1");
      expect(html).toContain("Section 2");
      expect(html).toContain("garden-toc");
    });
  });

  describe("renderTags", (): void => {
    it("should generate a tags page with tag cloud", (): void => {
      const tags: Record<string, TagEntry[]> = {
        dev: [{ title: "Note 1", path: "notes/note1" }],
        testing: [{ title: "Note 2", path: "notes/note2" }],
      };

      const html: string = renderer.renderTags(tags, defaultConfig);
      expect(html).toContain("Tags");
      expect(html).toContain("dev");
      expect(html).toContain("testing");
      expect(html).toContain("garden-tag-cloud");
    });

    it("should handle empty tags", (): void => {
      const html: string = renderer.renderTags({}, defaultConfig);
      expect(html).toContain("Tags");
    });
  });

  describe("renderTagDetail", (): void => {
    it("should generate a tag detail page", (): void => {
      const files: SiteGeneratedFile[] = [
        {
          html: "<p>Content</p>",
          relativePath: "notes/note1/index.html",
          title: "Note 1",
          tags: ["dev"],
          excerpt: "Excerpt",
          date: undefined,
        },
      ];

      const html: string = renderer.renderTagDetail(files, "dev", defaultConfig);
      expect(html).toContain("dev");
      expect(html).toContain("1 notes");
      expect(html).toContain("Note 1");
    });
  });

  describe("renderFeed", (): void => {
    it("should generate Atom feed XML", (): void => {
      const xml: string = renderer.renderFeed(
        [
          { title: "Note 1", slug: "note-1", date: "2026-01-15T00:00:00Z", excerpt: "First note" },
          { title: "Note 2", slug: "note-2", date: "2026-01-16T00:00:00Z", excerpt: "Second note" },
        ],
        defaultConfig,
      );

      expect(xml).toContain('<?xml version="1.0" encoding="utf-8"?>');
      expect(xml).toContain('<feed xmlns="http://www.w3.org/2005/Atom">');
      expect(xml).toContain("<title>My Garden</title>");
      expect(xml).toContain("<title>Note 1</title>");
      expect(xml).toContain("<title>Note 2</title>");
      expect(xml).toContain("/note-1/");
      expect(xml).toContain("/note-2/");
    });

    it("should handle empty entries", (): void => {
      const xml: string = renderer.renderFeed([], defaultConfig);
      expect(xml).toContain('<?xml version="1.0"');
    });
  });

  describe("buildTocHtml", (): void => {
    it("should generate TOC from H2 and H3 headings", (): void => {
      const html: string = "<h2 id=\"intro\">Introduction</h2><p>Text</p><h3 id=\"details\">Details</h3><p>More</p><h2 id=\"conclusion\">Conclusion</h2>";
      const toc: string = renderer.buildTocHtml(html);

      expect(toc).toContain("Introduction");
      expect(toc).toContain("Details");
      expect(toc).toContain("Conclusion");
      expect(toc).toContain("garden-toc-h2");
      expect(toc).toContain("garden-toc-h3");
    });

    it("should return empty string for single heading", (): void => {
      const toc: string = renderer.buildTocHtml("<h2>One Heading</h2><p>Content</p>");
      expect(toc).toBe("");
    });

    it("should return empty string for no headings", (): void => {
      const toc: string = renderer.buildTocHtml("<p>No headings here</p>");
      expect(toc).toBe("");
    });

    it("should strip HTML tags from heading text", (): void => {
      const toc: string = renderer.buildTocHtml("<h2>Intro</h2><p>A</p><h2><code>Code</code> Title</h2><p>B</p>");
      expect(toc).toContain("Code Title");
      expect(toc).not.toContain("<code>");
    });
  });

  describe("buildRelatedNotesHtml", (): void => {
    it("should build related notes list", (): void => {
      const relatedNotes: RelatedNoteEntry[] = [
        { slug: "note-a", title: "Note A", score: 0.8, repoPath: "notes/note-a/index.html" },
      ];

      const html: string = renderer.buildRelatedNotesHtml(relatedNotes, "https://example.com");
      expect(html).toContain("garden-related-list");
      expect(html).toContain("garden-related-item");
      expect(html).toContain("Note A");
      expect(html).toContain("https://example.com/notes/note-a/");
    });

    it("should return empty string for empty list", (): void => {
      const html: string = renderer.buildRelatedNotesHtml([], "https://example.com");
      expect(html).toBe("");
    });
  });

  describe("buildCommentsHtml", (): void => {
    it("should build giscus embed script", (): void => {
      const config: GiscusConfig = {
        repo: "user/blog",
        repoId: "R_123",
        category: "Comments",
        categoryId: "C_456",
      };

      const html: string = renderer.buildCommentsHtml(config);
      expect(html).toContain("giscus.app/client.js");
      expect(html).toContain("user/blog");
      expect(html).toContain("R_123");
      expect(html).toContain("Comments");
      expect(html).toContain("C_456");
    });

    it("should return empty string when no config", (): void => {
      const html: string = renderer.buildCommentsHtml(undefined);
      expect(html).toBe("");
    });
  });

  describe("escapeHtml", (): void => {
    it("should escape HTML entities in title", (): void => {
      const html: string = renderer.renderNote(
        "<p>Content</p>",
        "<script>alert('xss')</script>",
        [],
        undefined,
        defaultConfig,
      );

      expect(html).toContain("&lt;script&gt;");
      expect(html).toContain("&#039;xss&#039;");
    });
  });
});