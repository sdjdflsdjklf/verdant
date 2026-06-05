/**
 * @jest-environment jsdom
 */

import { MarkdownRenderer } from "./markdown.renderer";
import type { App } from "obsidian";

// Mock must use inline jest.fn() — variables can't be referenced before hoisting
jest.mock("obsidian", (): object => ({
  MarkdownRenderer: {
    render: jest.fn(),
  },
  Component: jest.fn().mockImplementation(() => ({
    load: jest.fn(),
    unload: jest.fn(),
  })),
}), { virtual: true });

describe("MarkdownRenderer", (): void => {
  let renderer: MarkdownRenderer;
  let mockApp: App;

  beforeEach((): void => {
    mockApp = {} as App;
    renderer = new MarkdownRenderer(mockApp);

    // Polyfill Obsidian's setCssProps on jsdom elements
    if (typeof HTMLElement.prototype.setCssProps !== "function") {
      HTMLElement.prototype.setCssProps = function (props: Record<string, string>): void {
        for (const [key, value] of Object.entries(props)) {
          this.style.setProperty(key, value);
        }
      };
    }

    // Reset and wire up the mock render function
    const obsidianRenderer = jest.requireMock("obsidian").MarkdownRenderer as {
      render: jest.Mock;
    };
    obsidianRenderer.render.mockReset();
  });

  it("should render markdown content to HTML string", async (): Promise<void> => {
    const obsidianRenderer = jest.requireMock("obsidian").MarkdownRenderer as {
      render: jest.Mock;
    };
    obsidianRenderer.render.mockImplementation(
      async (
        _app: App,
        _content: string,
        el: HTMLElement,
        _sourcePath: string,
        _component: { load: () => void; unload: () => void },
      ): Promise<void> => {
        el.innerHTML = "<p>Hello <strong>World</strong></p>";
      },
    );

    const result: string = await renderer.render("# Hello", "/note.md");

    expect(result).toBe("<p>Hello <strong>World</strong></p>");
    expect(obsidianRenderer.render).toHaveBeenCalledTimes(1);
    expect(obsidianRenderer.render).toHaveBeenCalledWith(
      mockApp,
      "# Hello",
      expect.any(HTMLElement),
      "/note.md",
      expect.anything(),
    );
  });

  it("should handle empty content", async (): Promise<void> => {
    const obsidianRenderer = jest.requireMock("obsidian").MarkdownRenderer as {
      render: jest.Mock;
    };
    obsidianRenderer.render.mockImplementation(
      async (
        _app: App,
        _content: string,
        el: HTMLElement,
        _sourcePath: string,
        _component: { load: () => void; unload: () => void },
      ): Promise<void> => {
        el.innerHTML = "";
      },
    );

    const result: string = await renderer.render("", "/empty.md");

    expect(result).toBe("");
  });

  it("should propagate errors from Obsidian renderer", async (): Promise<void> => {
    const obsidianRenderer = jest.requireMock("obsidian").MarkdownRenderer as {
      render: jest.Mock;
    };
    obsidianRenderer.render.mockRejectedValue(new Error("Render failed"));

    await expect(renderer.render("# Bad", "/bad.md")).rejects.toThrow(
      "Render failed",
    );
  });
});
