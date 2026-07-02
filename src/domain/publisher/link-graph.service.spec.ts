import { LinkGraphService, LinkGraph, RelatedNoteEntry } from "./link-graph.service";
import type { PublishFile } from "../../types/publisher.types";

function makeFile(relativePath: string, content: string): PublishFile {
  return {
    relativePath,
    absolutePath: `/vault/${relativePath}`,
    content,
    hash: `hash_${relativePath}`,
    mtime: 1716000000000,
  };
}

describe("LinkGraphService", (): void => {
  let service: LinkGraphService;

  beforeEach((): void => {
    service = new LinkGraphService();
  });

  describe("buildGraph", (): void => {
    it("should build an empty graph for no notes", (): void => {
      const graph: LinkGraph = service.buildGraph([]);
      expect(graph.edges.size).toBe(0);
      expect(graph.backlinks.size).toBe(0);
    });

    it("should build graph from notes with wiki links", (): void => {
      const notes: PublishFile[] = [
        makeFile("notes/a.md", "---\ntitle: Note A\n---\nLinks to [[Note B]] and [[Note C]]"),
        makeFile("notes/b.md", "---\ntitle: Note B\n---\nLinks to [[Note A]]"),
        makeFile("notes/c.md", "---\ntitle: Note C\n---\nNo links here"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);

      const aEdges: Set<string> | undefined = graph.edges.get("a");
      expect(aEdges).toBeDefined();
      expect(aEdges?.has("b")).toBe(true);
      expect(aEdges?.has("c")).toBe(true);

      const bEdges: Set<string> | undefined = graph.edges.get("b");
      expect(bEdges).toBeDefined();
      expect(bEdges?.has("a")).toBe(true);

      const cEdges: Set<string> | undefined = graph.edges.get("c");
      expect(cEdges).toBeDefined();
      expect(cEdges?.size).toBe(0);

      expect(graph.backlinks.get("b")?.has("a")).toBe(true);
      expect(graph.backlinks.get("a")?.has("b")).toBe(true);
    });

    it("should ignore self-references", (): void => {
      const notes: PublishFile[] = [
        makeFile("notes/a.md", "---\ntitle: Note A\n---\nLinks to [[Note A]]"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);
      expect(graph.edges.get("a")?.size).toBe(0);
    });

    it("should ignore links to non-existent notes", (): void => {
      const notes: PublishFile[] = [
        makeFile("notes/a.md", "---\ntitle: Note A\n---\nLinks to [[Ghost Note]]"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);
      expect(graph.edges.get("a")?.size).toBe(0);
    });

    it("should extract title from frontmatter", (): void => {
      const notes: PublishFile[] = [
        makeFile("notes/hello.md", "---\ntitle: Hello World\n---\nContent"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);
      expect(graph.slugToTitle.get("hello")).toBe("Hello World");
    });

    it("should extract title from H1 when no frontmatter", (): void => {
      const notes: PublishFile[] = [
        makeFile("notes/title.md", "# My Heading\n\nContent"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);
      expect(graph.slugToTitle.get("title")).toBe("My Heading");
    });

    it("should handle notes with aliased wiki links", (): void => {
      const notes: PublishFile[] = [
        makeFile("notes/a.md", "---\ntitle: Note A\n---\n[[Note B|fancy alias]]"),
        makeFile("notes/b.md", "---\ntitle: Note B\n---\nContent"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);
      expect(graph.edges.get("a")?.has("b")).toBe(true);
    });

    it("should map file names, full paths, and titles to published URLs", (): void => {
      const notes: PublishFile[] = [
        makeFile("AI_Actions/ARCHITECTURE.md", "---\ntitle: Architecture Overview\n---\nContent"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);

      expect(graph.linkNameToUrl.get("architecture")).toBe("ai_actions/architecture/");
      expect(graph.linkNameToUrl.get("ai_actions/architecture")).toBe("ai_actions/architecture/");
      expect(graph.linkNameToUrl.get("architecture-overview")).toBe("ai_actions/architecture/");
    });
  });

  describe("resolveWikiLink", (): void => {
    it("should resolve a link by file name slug", (): void => {
      const notes: PublishFile[] = [
        makeFile("AI_Actions/ARCHITECTURE.md", "---\ntitle: Architecture\n---\nContent"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);
      const url: string | undefined = service.resolveWikiLink({ name: "ARCHITECTURE" }, graph);

      expect(url).toBe("ai_actions/architecture/");
    });

    it("should resolve a link by full folder path", (): void => {
      const notes: PublishFile[] = [
        makeFile("AI_Actions/ARCHITECTURE.md", "---\ntitle: Architecture\n---\nContent"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);
      const url: string | undefined = service.resolveWikiLink(
        { name: "ARCHITECTURE", folder: "AI_Actions" },
        graph,
      );

      expect(url).toBe("ai_actions/architecture/");
    });

    it("should resolve a link by title slug", (): void => {
      const notes: PublishFile[] = [
        makeFile("notes/b.md", "---\ntitle: Note B\n---\nContent"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);
      const url: string | undefined = service.resolveWikiLink({ name: "Note B" }, graph);

      expect(url).toBe("notes/b/");
    });

    it("should return undefined for unresolved links", (): void => {
      const notes: PublishFile[] = [
        makeFile("notes/a.md", "---\ntitle: Note A\n---\nContent"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);
      const url: string | undefined = service.resolveWikiLink({ name: "Ghost Note" }, graph);

      expect(url).toBeUndefined();
    });
  });

  describe("getRelatedNotes", (): void => {
    it("should return notes ranked by Jaccard similarity", (): void => {
      const notes: PublishFile[] = [
        makeFile("notes/a.md", "---\ntitle: Note A\n---\n[[Note B]] [[Note C]]"),
        makeFile("notes/b.md", "---\ntitle: Note B\n---\n[[Note A]] [[Note C]]"),
        makeFile("notes/c.md", "---\ntitle: Note C\n---\n[[Note A]] [[Note B]]"),
        makeFile("notes/d.md", "---\ntitle: Note D\n---\n[[Note A]]"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);
      const related: RelatedNoteEntry[] = service.getRelatedNotes("a", graph);

      expect(related.length).toBeGreaterThan(0);
      expect(related[0]?.slug).toBe("b");
      expect(related[0]?.score).toBeCloseTo(1 / 3, 5);
    });

    it("should return empty array when no related notes", (): void => {
      const notes: PublishFile[] = [
        makeFile("notes/a.md", "---\ntitle: Note A\n---\nNo links"),
        makeFile("notes/b.md", "---\ntitle: Note B\n---\nNo links"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);
      const related: RelatedNoteEntry[] = service.getRelatedNotes("a", graph);

      expect(related).toEqual([]);
    });

    it("should respect the limit parameter", (): void => {
      const notes: PublishFile[] = [];
      for (let i: number = 0; i < 10; i++) {
        const links: string = Array.from({ length: 9 }, (_, j: number) => {
          if (j === i) return "";
          return `[[Note ${String.fromCharCode(65 + j)}]]`;
        }).filter(Boolean).join(" ");
        notes.push(makeFile(`notes/${String.fromCharCode(97 + i)}.md`, `---\ntitle: Note ${String.fromCharCode(65 + i)}\n---\n${links}`));
      }

      const graph: LinkGraph = service.buildGraph(notes);
      const related: RelatedNoteEntry[] = service.getRelatedNotes("a", graph, 3);

      expect(related.length).toBeLessThanOrEqual(3);
    });
  });

  describe("getPrevNext", (): void => {
    it("should return prev and next slugs in sorted order", (): void => {
      const notes: PublishFile[] = [
        makeFile("notes/a.md", "---\ntitle: Note A\n---\nContent"),
        makeFile("notes/b.md", "---\ntitle: Note B\n---\nContent"),
        makeFile("notes/c.md", "---\ntitle: Note C\n---\nContent"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);

      const result: { prev?: string; next?: string } = service.getPrevNext("b", graph, ["a", "b", "c"]);
      expect(result.prev).toBe("a");
      expect(result.next).toBe("c");
    });

    it("should return only next for first item", (): void => {
      const notes: PublishFile[] = [
        makeFile("notes/a.md", "---\ntitle: Note A\n---\nContent"),
        makeFile("notes/b.md", "---\ntitle: Note B\n---\nContent"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);

      const result: { prev?: string; next?: string } = service.getPrevNext("a", graph, ["a", "b"]);
      expect(result.prev).toBeUndefined();
      expect(result.next).toBe("b");
    });

    it("should return only prev for last item", (): void => {
      const notes: PublishFile[] = [
        makeFile("notes/a.md", "---\ntitle: Note A\n---\nContent"),
        makeFile("notes/b.md", "---\ntitle: Note B\n---\nContent"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);

      const result: { prev?: string; next?: string } = service.getPrevNext("b", graph, ["a", "b"]);
      expect(result.prev).toBe("a");
      expect(result.next).toBeUndefined();
    });

    it("should return empty for unknown slug", (): void => {
      const notes: PublishFile[] = [
        makeFile("notes/a.md", "---\ntitle: Note A\n---\nContent"),
      ];

      const graph: LinkGraph = service.buildGraph(notes);

      const result: { prev?: string; next?: string } = service.getPrevNext("unknown", graph, ["a"]);
      expect(result.prev).toBeUndefined();
      expect(result.next).toBeUndefined();
    });
  });
});