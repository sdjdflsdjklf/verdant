import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const themeFile = path.resolve(__dirname, "../src/domain/theme/styles/default.theme.ts");
const modulesDir = path.resolve(__dirname, "../src/domain/theme/styles/modules");

if (!fs.existsSync(modulesDir)) {
  fs.mkdirSync(modulesDir, { recursive: true });
}

const content = fs.readFileSync(themeFile, "utf-8");

const cssMatch = content.match(/export const DEFAULT_THEME_CSS = `([\s\S]*)`;/);
if (!cssMatch) {
  console.error("Failed to extract CSS from default.theme.ts");
  process.exit(1);
}
const css = cssMatch[1];

const lines = css.split("\n");

// Map section names to file names
const nameMap = {
  "Navigation": { file: "navigation", desc: "Top navigation bar: sticky header, brand, logo, menu toggle, nav links" },
  "Content": { file: "content", desc: "Content wrapper: max-width container with padding" },
  "Home": { file: "home", desc: "Home page: header, description, search input, search results" },
  "Cards": { file: "cards", desc: "Note cards: grid layout, card hover effects, title, excerpt, meta" },
  "Tags": { file: "tags", desc: "Tag styling: inline tag badges with accent colors" },
  "Note Page": { file: "note-page", desc: "Note page layout: two-column grid, header with title and meta" },
  "TOC Sidebar": { file: "note-body", desc: "Note body: TOC sidebar, typography (headings, code, pre, blockquote, img, table)" },
  "Related Notes": { file: "related-notes", desc: "Related notes section at bottom of note pages" },
  "Comments": { file: "comments", desc: "Giscus comments section" },
  "Note Footer": { file: "note-footer", desc: "Note footer: tags display and prev/next pagination" },
  "Tags Page": { file: "tags-page", desc: "Tags index page: tag cloud with variable font sizes" },
  "Tag Detail": { file: "tag-detail", desc: "Tag detail page: header with tag name and note count" },
  "Empty State": { file: "empty-state", desc: "Empty state: dashed border container with icon" },
  "Pagination": { file: "pagination", desc: "Pagination: page numbers, prev/next buttons" },
  "Footer": { file: "footer", desc: "Site footer: centered text, links, stats" },
  "Responsive": { file: "responsive", desc: "Responsive media queries: mobile and tablet breakpoints" },
  "Print": { file: "print", desc: "Print styles: hide nav/footer, show link URLs" },
};

// Find all section comments
const sectionStarts = [];
let i = 0;
while (i < lines.length) {
  const line = lines[i];
  if (line && line.trim().startsWith("/*") && line.includes("═══")) {
    const nextLine = i + 1 < lines.length ? lines[i + 1] : "";
    const nextNextLine = i + 2 < lines.length ? lines[i + 2] : "";
    if (nextNextLine && nextNextLine.includes("═══") && nextNextLine.includes("*/")) {
      const sectionName = nextLine.trim();
      sectionStarts.push({ name: sectionName, lineIndex: i });
      i += 3;
      continue;
    }
  }
  i++;
}

console.log("Found sections:", sectionStarts.map(s => s.name));

// Build modules
const modules = [];

// Module 0: Variables + Reset + Base (before first section comment)
const firstSectionIdx = sectionStarts.length > 0 ? sectionStarts[0].lineIndex : lines.length;
modules.push({
  name: "variables",
  description: "CSS custom properties, reset, html/body base styles",
  startLine: 0,
  endLine: firstSectionIdx,
});

// Rest of modules
for (let s = 0; s < sectionStarts.length; s++) {
  const current = sectionStarts[s];
  const next = s + 1 < sectionStarts.length ? sectionStarts[s + 1] : null;
  const start = current.lineIndex;
  const end = next ? next.lineIndex : lines.length;

  const mapped = nameMap[current.name];
  if (!mapped) {
    console.warn(`Unknown section: "${current.name}"`);
    continue;
  }

  modules.push({
    name: mapped.file,
    description: mapped.desc,
    startLine: start,
    endLine: end,
  });
}

// Generate module files
for (const mod of modules) {
  const modLines = lines.slice(mod.startLine, mod.endLine);
  // Remove trailing empty lines
  while (modLines.length > 0 && modLines[modLines.length - 1].trim() === "") {
    modLines.pop();
  }
  // Remove leading empty lines
  while (modLines.length > 0 && modLines[0].trim() === "") {
    modLines.shift();
  }

  const cssContent = modLines.join("\n");

  const fileContent = `export const CSS_${mod.name.toUpperCase().replace(/-/g, "_")} = \`${cssContent}\`;
`;

  const filePath = path.join(modulesDir, `${mod.name}.ts`);
  fs.writeFileSync(filePath, fileContent, "utf-8");
  console.log(`Created: ${mod.name}.ts (${modLines.length} lines)`);
}

// Generate index.ts
const indexLines = [];
indexLines.push("// Auto-generated CSS module index");
indexLines.push("// Run: node scripts/split-theme-css.mjs to regenerate");
indexLines.push("");
for (const mod of modules) {
  const constName = `CSS_${mod.name.toUpperCase().replace(/-/g, "_")}`;
  indexLines.push(`export { ${constName} } from "./${mod.name}";`);
}

fs.writeFileSync(path.join(modulesDir, "index.ts"), indexLines.join("\n") + "\n", "utf-8");
console.log("Created: modules/index.ts");

// Generate module-registry.ts
const registryLines = [];
registryLines.push("import {");
for (const mod of modules) {
  const constName = `CSS_${mod.name.toUpperCase().replace(/-/g, "_")}`;
  registryLines.push(`  ${constName},`);
}
registryLines.push(`} from "./modules/index";`);
registryLines.push("");
registryLines.push(`export interface CssModule {`);
registryLines.push(`  name: string;`);
registryLines.push(`  description: string;`);
registryLines.push(`  css: string;`);
registryLines.push(`  lineCount: number;`);
registryLines.push(`}`);
registryLines.push("");
registryLines.push(`const MODULES: CssModule[] = [`);
for (const mod of modules) {
  const constName = `CSS_${mod.name.toUpperCase().replace(/-/g, "_")}`;
  registryLines.push(`  { name: "${mod.name}", description: "${mod.description}", css: ${constName}, lineCount: ${constName}.split("\\n").length },`);
}
registryLines.push(`];`);
registryLines.push("");
registryLines.push(`const NAME_MAP: Map<string, CssModule> = new Map();`);
registryLines.push(`for (const m of MODULES) {`);
registryLines.push(`  NAME_MAP.set(m.name, m);`);
registryLines.push(`}`);
registryLines.push("");
registryLines.push(`export function getCssModule(name: string): CssModule | undefined {`);
registryLines.push(`  return NAME_MAP.get(name);`);
registryLines.push(`}`);
registryLines.push("");
registryLines.push(`export function getAllModules(): CssModule[] {`);
registryLines.push(`  return MODULES;`);
registryLines.push(`}`);
registryLines.push("");
registryLines.push(`export function getCombinedCss(): string {`);
registryLines.push(`  return MODULES.map((m) => m.css).join("\\n\\n");`);
registryLines.push(`}`);
registryLines.push("");
registryLines.push(`export function getModuleIndex(): Array<{ name: string; description: string; lines: number }> {`);
registryLines.push(`  return MODULES.map((m) => ({ name: m.name, description: m.description, lines: m.lineCount }));`);
registryLines.push(`}`);

const registryPath = path.resolve(__dirname, "../src/domain/theme/styles/module-registry.ts");
fs.writeFileSync(registryPath, registryLines.join("\n") + "\n", "utf-8");
console.log("Created: module-registry.ts");
console.log("Done! Split default theme CSS into modules.");