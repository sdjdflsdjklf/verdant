import {
  CSS_VARIABLES,
  CSS_NAVIGATION,
  CSS_CONTENT,
  CSS_HOME,
  CSS_CARDS,
  CSS_TAGS,
  CSS_NOTE_PAGE,
  CSS_NOTE_BODY,
  CSS_RELATED_NOTES,
  CSS_COMMENTS,
  CSS_NOTE_FOOTER,
  CSS_TAGS_PAGE,
  CSS_TAG_DETAIL,
  CSS_EMPTY_STATE,
  CSS_PAGINATION,
  CSS_FOOTER,
  CSS_RESPONSIVE,
  CSS_PRINT,
} from "./modules/index";

export interface CssModule {
  name: string;
  description: string;
  css: string;
  lineCount: number;
}

const MODULES: CssModule[] = [
  { name: "variables", description: "CSS custom properties, reset, html/body base styles", css: CSS_VARIABLES, lineCount: CSS_VARIABLES.split("\n").length },
  { name: "navigation", description: "Top navigation bar: sticky header, brand, logo, menu toggle, nav links", css: CSS_NAVIGATION, lineCount: CSS_NAVIGATION.split("\n").length },
  { name: "content", description: "Content wrapper: max-width container with padding", css: CSS_CONTENT, lineCount: CSS_CONTENT.split("\n").length },
  { name: "home", description: "Home page: header, description, search input, search results", css: CSS_HOME, lineCount: CSS_HOME.split("\n").length },
  { name: "cards", description: "Note cards: grid layout, card hover effects, title, excerpt, meta", css: CSS_CARDS, lineCount: CSS_CARDS.split("\n").length },
  { name: "tags", description: "Tag styling: inline tag badges with accent colors", css: CSS_TAGS, lineCount: CSS_TAGS.split("\n").length },
  { name: "note-page", description: "Note page layout: two-column grid, header with title and meta", css: CSS_NOTE_PAGE, lineCount: CSS_NOTE_PAGE.split("\n").length },
  { name: "note-body", description: "Note body: TOC sidebar, typography (headings, code, pre, blockquote, img, table)", css: CSS_NOTE_BODY, lineCount: CSS_NOTE_BODY.split("\n").length },
  { name: "related-notes", description: "Related notes section at bottom of note pages", css: CSS_RELATED_NOTES, lineCount: CSS_RELATED_NOTES.split("\n").length },
  { name: "comments", description: "Giscus comments section", css: CSS_COMMENTS, lineCount: CSS_COMMENTS.split("\n").length },
  { name: "note-footer", description: "Note footer: tags display and prev/next pagination", css: CSS_NOTE_FOOTER, lineCount: CSS_NOTE_FOOTER.split("\n").length },
  { name: "tags-page", description: "Tags index page: tag cloud with variable font sizes", css: CSS_TAGS_PAGE, lineCount: CSS_TAGS_PAGE.split("\n").length },
  { name: "tag-detail", description: "Tag detail page: header with tag name and note count", css: CSS_TAG_DETAIL, lineCount: CSS_TAG_DETAIL.split("\n").length },
  { name: "empty-state", description: "Empty state: dashed border container with icon", css: CSS_EMPTY_STATE, lineCount: CSS_EMPTY_STATE.split("\n").length },
  { name: "pagination", description: "Pagination: page numbers, prev/next buttons", css: CSS_PAGINATION, lineCount: CSS_PAGINATION.split("\n").length },
  { name: "footer", description: "Site footer: centered text, links, stats", css: CSS_FOOTER, lineCount: CSS_FOOTER.split("\n").length },
  { name: "responsive", description: "Responsive media queries: mobile and tablet breakpoints", css: CSS_RESPONSIVE, lineCount: CSS_RESPONSIVE.split("\n").length },
  { name: "print", description: "Print styles: hide nav/footer, show link URLs", css: CSS_PRINT, lineCount: CSS_PRINT.split("\n").length },
];

const NAME_MAP: Map<string, CssModule> = new Map();
for (const m of MODULES) {
  NAME_MAP.set(m.name, m);
}

export function getCssModule(name: string): CssModule | undefined {
  return NAME_MAP.get(name);
}

export function getAllModules(): CssModule[] {
  return MODULES;
}

export function getCombinedCss(): string {
  return MODULES.map((m) => m.css).join("\n\n");
}

export function getModuleIndex(): Array<{ name: string; description: string; lines: number }> {
  return MODULES.map((m) => ({ name: m.name, description: m.description, lines: m.lineCount }));
}
