# 智能体编辑与内容处理功能 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 AI 智能体添加读取、搜索和编辑（重写/更新）四种工具，实现内容修改精度提升40%、操作步骤减少30%。

**Architecture:** 在现有 AiService 的 Function Calling 循环中扩展四种新工具（read_content、search_content、edit_rewrite、edit_update），每种工具有独立的服务层逻辑和统一的工具卡片 UI（3态：执行中/成功/失败）。CSS 从内联注入迁移到 styles.css，图标从内联 SVG 迁移到 lucide-static 库。

**Tech Stack:** TypeScript, tsyringe DI, Obsidian DOM API, lucide-static, CSS custom properties

---

## File Structure

| Operation | Path | Responsibility |
|-----------|------|----------------|
| Create | `src/shared/icons/index.ts` | lucide-static 图标导出与尺寸/颜色工具函数 |
| Modify | `src/types/ai.types.ts` | 新增工具定义、工具结果类型、编辑历史类型 |
| Create | `src/domain/agent/read-tool.service.ts` | 读取工具业务逻辑（局部/全部读取、行号解析） |
| Create | `src/domain/agent/search-tool.service.ts` | 搜索工具业务逻辑（关键词/正则/模糊匹配） |
| Create | `src/domain/agent/edit-tool.service.ts` | 编辑工具业务逻辑（重写/更新、语法校验、历史保存） |
| Modify | `src/domain/ai/ai.service.ts` | 扩展对话循环支持多工具、工具状态追踪 |
| Modify | `src/di/tokens.ts` | 新增 DI Token |
| Modify | `src/di/registrations.ts` | 注册新服务 |
| Modify | `styles.css` | 迁移 AI 面板样式 + 新增工具卡片样式 + 工具类 |
| Modify | `src/presentation/components/ai-chat-panel.view.ts` | 重构 UI：lucide 图标、工具卡片3态渲染、折叠内容 |
| Create | `tests/unit/agent/read-tool.service.spec.ts` | 读取工具单元测试 |
| Create | `tests/unit/agent/search-tool.service.spec.ts` | 搜索工具单元测试 |
| Create | `tests/unit/agent/edit-tool.service.spec.ts` | 编辑工具单元测试 |
| Create | `tests/unit/agent/ai-service-multi-tool.spec.ts` | AI 服务多工具集成测试 |

---

### Task 1: 安装 lucide-static 并创建图标工具模块

**Files:**
- Modify: `package.json` (添加依赖)
- Create: `src/shared/icons/index.ts`

- [ ] **Step 1: 安装 lucide-static**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npm install lucide-static`

- [ ] **Step 2: 创建图标工具模块**

```typescript
// src/shared/icons/index.ts
import {
  Bot,
  X,
  Send,
  User,
  Wrench,
  CircleCheck,
  CircleAlert,
  FileSearch,
  Search,
  PenLine,
  FilePenLine,
  ChevronDown,
  ChevronRight,
  Loader,
  FileText,
  Code,
} from "lucide-static";

export const ICONS = {
  bot: Bot,
  close: X,
  send: Send,
  user: User,
  wrench: Wrench,
  check: CircleCheck,
  alert: CircleAlert,
  fileSearch: FileSearch,
  search: Search,
  editRewrite: FilePenLine,
  editUpdate: PenLine,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  loader: Loader,
  fileText: FileText,
  code: Code,
} as const;

export function icon(
  name: keyof typeof ICONS,
  size: number = 16,
  color: string = "currentColor",
): string {
  const raw: string = ICONS[name];
  return raw
    .replace(/width="\d+"/, `width="${size}"`)
    .replace(/height="\d+"/, `height="${size}"`)
    .replace(/stroke="currentColor"/g, `stroke="${color}"`);
}
```

- [ ] **Step 3: 验证安装和导入**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx tsc --noEmit src/shared/icons/index.ts`
Expected: 无错误

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/shared/icons/index.ts
git commit -m "feat: add lucide-static icon library and icon utility module"
```

---

### Task 2: 扩展 AI 类型定义

**Files:**
- Modify: `src/types/ai.types.ts`

- [ ] **Step 1: 添加工具状态和结果类型**

在 `ai.types.ts` 末尾（`AI_SITE_HTML_CONTEXT` 常量之前）添加：

```typescript
export type AiToolState = "executing" | "success" | "failure";

export type AiToolName =
  | "generate_css"
  | "read_content"
  | "search_content"
  | "edit_rewrite"
  | "edit_update";

export interface AiToolResult {
  toolCallId: string;
  toolName: AiToolName;
  state: AiToolState;
  title: string;
  content: string;
  data?: unknown;
}

export interface AiReadResult {
  content: string;
  lineCount: number;
  range?: { start: number; end: number };
}

export interface AiSearchMatch {
  line: number;
  column: number;
  text: string;
}

export interface AiSearchResult {
  matches: AiSearchMatch[];
  totalMatches: number;
  query: string;
  isRegex: boolean;
}

export interface AiEditSnapshot {
  timestamp: number;
  css: string;
  toolCallId: string;
  mode: "rewrite" | "update";
}
```

- [ ] **Step 2: 扩展 AiChatSession 类型**

修改 `AiChatSession` 接口，添加 `toolResults` 和 `editHistory` 字段：

```typescript
export interface AiChatSession {
  id: string;
  messages: AiChatMessage[];
  state: AiPanelState;
  currentCss: string;
  validationResults: CssValidationResult[];
  toolResults: AiToolResult[];
  editHistory: AiEditSnapshot[];
}
```

- [ ] **Step 3: 添加新工具定义常量**

在 `CSS_GENERATE_TOOL_DEFINITION` 之后添加：

```typescript
export const AI_TOOL_READ_CONTENT = "read_content";

export const READ_CONTENT_TOOL_DEFINITION: AiToolDefinition = {
  name: AI_TOOL_READ_CONTENT,
  description:
    "Read the current CSS content of the site. Supports reading specific line ranges or the entire file. Use this to understand the current styles before making edits.",
  parameters: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "A descriptive title for what you are reading (e.g., 'current nav styles').",
      },
      startLine: {
        type: "number",
        description: "Starting line number (1-based). Omit for full read.",
      },
      endLine: {
        type: "number",
        description: "Ending line number (1-based, inclusive). Omit for full read.",
      },
    },
    required: ["title"],
  },
};

export const AI_TOOL_SEARCH_CONTENT = "search_content";

export const SEARCH_CONTENT_TOOL_DEFINITION: AiToolDefinition = {
  name: AI_TOOL_SEARCH_CONTENT,
  description:
    "Search within the current CSS content using keywords or regular expressions. Use this to find specific selectors, properties, or patterns before editing.",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search keyword or regular expression pattern.",
      },
      isRegex: {
        type: "boolean",
        description: "Whether the query is a regular expression. Default: false (keyword search).",
      },
      isFuzzy: {
        type: "boolean",
        description: "Enable fuzzy matching for keyword search. Default: false (exact match).",
      },
    },
    required: ["query"],
  },
};

export const AI_TOOL_EDIT_REWRITE = "edit_rewrite";

export const EDIT_REWRITE_TOOL_DEFINITION: AiToolDefinition = {
  name: AI_TOOL_EDIT_REWRITE,
  description:
    "Completely replace the entire CSS with new content. Use this when making major style overhauls. The CSS will be validated automatically after rewriting.",
  parameters: {
    type: "object",
    properties: {
      css: {
        type: "string",
        description: "The complete new CSS code to replace all existing styles.",
      },
      description: {
        type: "string",
        description: "Brief description of what the rewrite does.",
      },
    },
    required: ["css"],
  },
};

export const AI_TOOL_EDIT_UPDATE = "edit_update";

export const EDIT_UPDATE_TOOL_DEFINITION: AiToolDefinition = {
  name: AI_TOOL_EDIT_UPDATE,
  description:
    "Update specific lines of the CSS content. Use this for targeted modifications. The CSS will be validated automatically after updating. Always read the content first to identify exact line numbers.",
  parameters: {
    type: "object",
    properties: {
      startLine: {
        type: "number",
        description: "Starting line number to replace (1-based).",
      },
      endLine: {
        type: "number",
        description: "Ending line number to replace (1-based, inclusive).",
      },
      newContent: {
        type: "string",
        description: "The new CSS content to replace the specified line range.",
      },
      description: {
        type: "string",
        description: "Brief description of what the update does.",
      },
    },
    required: ["startLine", "endLine", "newContent"],
  },
};

export const ALL_AI_TOOL_DEFINITIONS: AiToolDefinition[] = [
  CSS_GENERATE_TOOL_DEFINITION,
  READ_CONTENT_TOOL_DEFINITION,
  SEARCH_CONTENT_TOOL_DEFINITION,
  EDIT_REWRITE_TOOL_DEFINITION,
  EDIT_UPDATE_TOOL_DEFINITION,
];
```

- [ ] **Step 4: 更新 AI_BASE_SYSTEM_PROMPT**

修改 `AI_BASE_SYSTEM_PROMPT` 常量，在 Rules 部分添加新工具使用指引：

```
When the user asks you to modify styles, colors, fonts, layout, or any visual aspect of the site, follow this workflow:
1. Use "read_content" to understand the current CSS structure
2. Use "search_content" to find specific selectors or properties if needed
3. Use "edit_update" for targeted changes (preferred) or "edit_rewrite" for complete overhauls
4. You can also use "generate_css" as a legacy tool that replaces all CSS

## Rules
- Always read the current CSS before editing to understand the existing structure
- Prefer "edit_update" for small, targeted changes — it preserves existing styles
- Use "edit_rewrite" only when making major changes that affect most of the stylesheet
- All edit tools validate CSS automatically; if errors are reported, fix them and retry
- Use CSS custom properties (variables) from the current theme when possible
- Keep CSS selectors scoped to .garden-* classes
- Your CSS will be injected AFTER the theme CSS
- Be concise and helpful in your explanations
```

- [ ] **Step 5: 验证类型检查**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx tsc --noEmit`
Expected: 无新增错误

- [ ] **Step 6: Commit**

```bash
git add src/types/ai.types.ts
git commit -m "feat: extend AI types with read/search/edit tool definitions and result types"
```

---

### Task 3: 实现读取工具服务

**Files:**
- Create: `src/domain/agent/read-tool.service.ts`
- Create: `tests/unit/agent/read-tool.service.spec.ts`

- [ ] **Step 1: 编写读取工具单元测试**

```typescript
// tests/unit/agent/read-tool.service.spec.ts
import { ReadToolService } from "../../../src/domain/agent/read-tool.service";
import type { AiReadResult } from "../../../src/types/ai.types";

describe("ReadToolService", () => {
  let service: ReadToolService;

  beforeEach(() => {
    service = new ReadToolService();
  });

  describe("read", () => {
    const testCss = [
      ".garden-nav { height: 60px; }",
      ".garden-nav-header { display: flex; }",
      ".garden-brand { font-weight: 600; }",
      ".garden-card { border-radius: 12px; }",
      ".garden-card-title { font-size: 16px; }",
    ].join("\n");

    it("should read entire content when no line range specified", () => {
      const result: AiReadResult = service.read(testCss, {});
      expect(result.content).toBe(testCss);
      expect(result.lineCount).toBe(5);
      expect(result.range).toBeUndefined();
    });

    it("should read specific line range", () => {
      const result: AiReadResult = service.read(testCss, { startLine: 2, endLine: 4 });
      expect(result.lineCount).toBe(3);
      expect(result.range).toEqual({ start: 2, end: 4 });
      expect(result.content).toContain("garden-nav-header");
      expect(result.content).toContain("garden-brand");
      expect(result.content).toContain("garden-card");
      expect(result.content).not.toContain("garden-nav {");
    });

    it("should fallback to full read when startLine is invalid", () => {
      const result: AiReadResult = service.read(testCss, { startLine: -1 });
      expect(result.content).toBe(testCss);
      expect(result.lineCount).toBe(5);
      expect(result.range).toBeUndefined();
    });

    it("should fallback to full read when endLine < startLine", () => {
      const result: AiReadResult = service.read(testCss, { startLine: 4, endLine: 2 });
      expect(result.content).toBe(testCss);
      expect(result.range).toBeUndefined();
    });

    it("should fallback to full read when line range is NaN", () => {
      const result: AiReadResult = service.read(testCss, { startLine: NaN, endLine: NaN });
      expect(result.content).toBe(testCss);
      expect(result.range).toBeUndefined();
    });

    it("should handle startLine beyond content length", () => {
      const result: AiReadResult = service.read(testCss, { startLine: 100, endLine: 200 });
      expect(result.content).toBe("");
      expect(result.lineCount).toBe(0);
      expect(result.range).toEqual({ start: 100, end: 200 });
    });

    it("should clamp endLine to content length", () => {
      const result: AiReadResult = service.read(testCss, { startLine: 3, endLine: 100 });
      expect(result.lineCount).toBe(3);
      expect(result.range).toEqual({ start: 3, end: 5 });
    });

    it("should read single line when startLine equals endLine", () => {
      const result: AiReadResult = service.read(testCss, { startLine: 1, endLine: 1 });
      expect(result.lineCount).toBe(1);
      expect(result.content).toBe(".garden-nav { height: 60px; }");
    });

    it("should handle empty CSS", () => {
      const result: AiReadResult = service.read("", {});
      expect(result.content).toBe("");
      expect(result.lineCount).toBe(0);
    });
  });

  describe("parseLineRange", () => {
    it("should return undefined when both are undefined", () => {
      expect(service.parseLineRange(undefined, undefined)).toBeUndefined();
    });

    it("should return undefined when startLine is 0 or negative", () => {
      expect(service.parseLineRange(0, 5)).toBeUndefined();
      expect(service.parseLineRange(-1, 5)).toBeUndefined();
    });

    it("should return valid range", () => {
      expect(service.parseLineRange(1, 5)).toEqual({ start: 1, end: 5 });
    });

    it("should return undefined when endLine < startLine", () => {
      expect(service.parseLineRange(5, 1)).toBeUndefined();
    });
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx jest tests/unit/agent/read-tool.service.spec.ts --no-coverage`
Expected: FAIL - module not found

- [ ] **Step 3: 实现读取工具服务**

```typescript
// src/domain/agent/read-tool.service.ts
import { injectable } from "tsyringe";
import type { AiReadResult } from "../../types/ai.types";

export interface LineRange {
  startLine?: number;
  endLine?: number;
}

@injectable()
export class ReadToolService {
  public read(css: string, range: LineRange): AiReadResult {
    const lines: string[] = css.split("\n");
    const totalLines: number = lines.length;
    const parsedRange: { start: number; end: number } | undefined = this.parseLineRange(
      range.startLine,
      range.endLine,
    );

    if (parsedRange === undefined) {
      return {
        content: css,
        lineCount: totalLines,
      };
    }

    const startIdx: number = Math.max(0, parsedRange.start - 1);
    const endIdx: number = Math.min(totalLines, parsedRange.end);
    const content: string = lines.slice(startIdx, endIdx).join("\n");
    const actualEnd: number = Math.min(parsedRange.end, totalLines);

    return {
      content,
      lineCount: endIdx - startIdx,
      range: { start: parsedRange.start, end: actualEnd },
    };
  }

  public parseLineRange(
    startLine?: number,
    endLine?: number,
  ): { start: number; end: number } | undefined {
    if (startLine === undefined && endLine === undefined) return undefined;
    if (startLine === undefined || !Number.isFinite(startLine) || startLine < 1) return undefined;
    if (endLine === undefined || !Number.isFinite(endLine) || endLine < startLine) return undefined;
    return { start: startLine, end: endLine };
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx jest tests/unit/agent/read-tool.service.spec.ts --no-coverage`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/domain/agent/read-tool.service.ts tests/unit/agent/read-tool.service.spec.ts
git commit -m "feat: implement ReadToolService with line range parsing and full read fallback"
```

---

### Task 4: 实现搜索工具服务

**Files:**
- Create: `src/domain/agent/search-tool.service.ts`
- Create: `tests/unit/agent/search-tool.service.spec.ts`

- [ ] **Step 1: 编写搜索工具单元测试**

```typescript
// tests/unit/agent/search-tool.service.spec.ts
import { SearchToolService } from "../../../src/domain/agent/search-tool.service";
import type { AiSearchResult } from "../../../src/types/ai.types";

describe("SearchToolService", () => {
  let service: SearchToolService;

  beforeEach(() => {
    service = new SearchToolService();
  });

  const testCss = [
    ".garden-nav { height: 60px; background: var(--bg); }",
    ".garden-nav-header { display: flex; align-items: center; }",
    ".garden-brand { font-weight: 600; color: var(--accent); }",
    ".garden-card { border-radius: 12px; padding: 24px; }",
    ".garden-card-title { font-size: 16px; color: var(--text); }",
  ].join("\n");

  describe("search with exact match", () => {
    it("should find exact keyword matches", () => {
      const result: AiSearchResult = service.search(testCss, { query: "border-radius", isRegex: false, isFuzzy: false });
      expect(result.totalMatches).toBe(1);
      expect(result.matches[0].line).toBe(4);
      expect(result.matches[0].text).toContain("border-radius");
    });

    it("should find multiple matches across lines", () => {
      const result: AiSearchResult = service.search(testCss, { query: "color:", isRegex: false, isFuzzy: false });
      expect(result.totalMatches).toBe(2);
    });

    it("should return empty for no matches", () => {
      const result: AiSearchResult = service.search(testCss, { query: "nonexistent", isRegex: false, isFuzzy: false });
      expect(result.totalMatches).toBe(0);
      expect(result.matches).toEqual([]);
    });
  });

  describe("search with regex", () => => {
    it("should match regex patterns", () => {
      const result: AiSearchResult = service.search(testCss, { query: "\\.garden-\\w+\\s*\\{", isRegex: true });
      expect(result.totalMatches).toBe(5);
    });

    it("should handle invalid regex gracefully", () => {
      const result: AiSearchResult = service.search(testCss, { query: "[invalid", isRegex: true });
      expect(result.totalMatches).toBe(0);
      expect(result.matches).toEqual([]);
    });
  });

  describe("search with fuzzy match", () => {
    it("should find fuzzy matches with character proximity", () => {
      const result: AiSearchResult = service.search(testCss, { query: "borderradius", isRegex: false, isFuzzy: true });
      expect(result.totalMatches).toBeGreaterThanOrEqual(1);
    });
  });

  describe("performance", () => {
    it("should handle 1000+ lines without noticeable lag", () => {
      const longCss: string = Array.from({ length: 1000 }, (_, i) => `.line-${i} { color: red; }`).join("\n");
      const start: number = Date.now();
      const result: AiSearchResult = service.search(longCss, { query: "color: red", isRegex: false, isFuzzy: false });
      const elapsed: number = Date.now() - start;
      expect(elapsed).toBeLessThan(300);
      expect(result.totalMatches).toBe(1000);
    });
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx jest tests/unit/agent/search-tool.service.spec.ts --no-coverage`
Expected: FAIL - module not found

- [ ] **Step 3: 实现搜索工具服务**

```typescript
// src/domain/agent/search-tool.service.ts
import { injectable } from "tsyringe";
import type { AiSearchResult, AiSearchMatch } from "../../types/ai.types";

export interface SearchParams {
  query: string;
  isRegex?: boolean;
  isFuzzy?: boolean;
}

@injectable()
export class SearchToolService {
  public search(css: string, params: SearchParams): AiSearchResult {
    const { query, isRegex = false, isFuzzy = false } = params;
    const lines: string[] = css.split("\n");
    const matches: AiSearchMatch[] = [];

    if (isRegex) {
      this.searchRegex(lines, query, matches);
    } else if (isFuzzy) {
      this.searchFuzzy(lines, query, matches);
    } else {
      this.searchExact(lines, query, matches);
    }

    return {
      matches,
      totalMatches: matches.length,
      query,
      isRegex,
    };
  }

  private searchExact(lines: string[], query: string, matches: AiSearchMatch[]): void {
    for (let i: number = 0; i < lines.length; i++) {
      const line: string | undefined = lines[i];
      if (line === undefined) continue;
      let col: number = line.indexOf(query);
      while (col !== -1) {
        matches.push({
          line: i + 1,
          column: col + 1,
          text: line.trim(),
        });
        col = line.indexOf(query, col + 1);
      }
    }
  }

  private searchRegex(lines: string[], pattern: string, matches: AiSearchMatch[]): void {
    let regex: RegExp;
    try {
      regex = new RegExp(pattern, "g");
    } catch {
      return;
    }

    for (let i: number = 0; i < lines.length; i++) {
      const line: string | undefined = lines[i];
      if (line === undefined) continue;
      regex.lastIndex = 0;
      let m: RegExpExecArray | null = regex.exec(line);
      while (m !== null) {
        matches.push({
          line: i + 1,
          column: m.index + 1,
          text: line.trim(),
        });
        m = regex.exec(line);
      }
    }
  }

  private searchFuzzy(lines: string[], query: string, matches: AiSearchMatch[]): void {
    const chars: string[] = query.toLowerCase().split("");
    for (let i: number = 0; i < lines.length; i++) {
      const line: string | undefined = lines[i];
      if (line === undefined) continue;
      const lower: string = line.toLowerCase();
      let charIdx: number = 0;
      let found: boolean = false;
      for (let j: number = 0; j < lower.length && charIdx < chars.length; j++) {
        if (lower[j] === chars[charIdx]) {
          charIdx++;
        }
      }
      if (charIdx === chars.length) {
        found = true;
      }
      if (found) {
        matches.push({
          line: i + 1,
          column: 1,
          text: line.trim(),
        });
      }
    }
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx jest tests/unit/agent/search-tool.service.spec.ts --no-coverage`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/domain/agent/search-tool.service.ts tests/unit/agent/search-tool.service.spec.ts
git commit -m "feat: implement SearchToolService with exact/regex/fuzzy matching"
```

---

### Task 5: 实现编辑工具服务

**Files:**
- Create: `src/domain/agent/edit-tool.service.ts`
- Create: `tests/unit/agent/edit-tool.service.spec.ts`

- [ ] **Step 1: 编写编辑工具单元测试**

```typescript
// tests/unit/agent/edit-tool.service.spec.ts
import { EditToolService } from "../../../src/domain/agent/edit-tool.service";
import type { AiEditSnapshot } from "../../../src/types/ai.types";

describe("EditToolService", () => {
  let service: EditToolService;

  beforeEach(() => {
    service = new EditToolService();
  });

  const testCss = [
    ".garden-nav { height: 60px; }",
    ".garden-nav-header { display: flex; }",
    ".garden-brand { font-weight: 600; }",
    ".garden-card { border-radius: 12px; }",
    ".garden-card-title { font-size: 16px; }",
  ].join("\n");

  describe("rewrite", () => {
    it("should replace entire CSS content", () => {
      const newCss = ".new-style { color: blue; }";
      const result: string = service.rewrite(testCss, newCss);
      expect(result).toBe(newCss);
    });

    it("should save snapshot before rewrite", () => {
      service.rewrite(testCss, ".new { }");
      const history: AiEditSnapshot[] = service.getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].mode).toBe("rewrite");
      expect(history[0].css).toBe(testCss);
    });
  });

  describe("update", () => {
    it("should replace specified line range", () => {
      const result: string = service.update(testCss, 2, 3, ".replaced { color: red; }");
      const lines: string[] = result.split("\n");
      expect(lines).toHaveLength(4);
      expect(lines[1]).toBe(".replaced { color: red; }");
      expect(lines[0]).toBe(".garden-nav { height: 60px; }");
    });

    it("should handle multi-line new content", () => {
      const newContent = ".line-a { color: red; }\n.line-b { color: blue; }";
      const result: string = service.update(testCss, 2, 2, newContent);
      const lines: string[] = result.split("\n");
      expect(lines).toHaveLength(6);
      expect(lines[1]).toBe(".line-a { color: red; }");
      expect(lines[2]).toBe(".line-b { color: blue; }");
    });

    it("should save snapshot before update", () => {
      service.update(testCss, 1, 1, ".new { }");
      const history: AiEditSnapshot[] = service.getHistory();
      expect(history).toHaveLength(1);
      expect(history[0].mode).toBe("update");
    });

    it("should throw on invalid line range", () => {
      expect(() => service.update(testCss, 0, 5, "x")).toThrow();
      expect(() => service.update(testCss, 5, 1, "x")).toThrow();
    });
  });

  describe("undo", () => {
    it("should restore previous CSS from history", () => {
      service.rewrite(testCss, ".new { }");
      const undone: string = service.undo(".new { }");
      expect(undone).toBe(testCss);
    });

    it("should return current CSS when no history", () => {
      const result: string = service.undo(testCss);
      expect(result).toBe(testCss);
    });
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx jest tests/unit/agent/edit-tool.service.spec.ts --no-coverage`
Expected: FAIL - module not found

- [ ] **Step 3: 实现编辑工具服务**

```typescript
// src/domain/agent/edit-tool.service.ts
import { injectable } from "tsyringe";
import type { AiEditSnapshot } from "../../types/ai.types";

@injectable()
export class EditToolService {
  private history: AiEditSnapshot[] = [];

  public rewrite(currentCss: string, newCss: string, toolCallId: string = ""): string {
    this.saveSnapshot(currentCss, toolCallId, "rewrite");
    return newCss;
  }

  public update(
    currentCss: string,
    startLine: number,
    endLine: number,
    newContent: string,
    toolCallId: string = "",
  ): string {
    if (startLine < 1 || endLine < startLine) {
      throw new Error(`Invalid line range: ${startLine}-${endLine}`);
    }

    this.saveSnapshot(currentCss, toolCallId, "update");

    const lines: string[] = currentCss.split("\n");
    const before: string[] = lines.slice(0, startLine - 1);
    const after: string[] = lines.slice(endLine);
    const newLines: string[] = newContent.split("\n");

    return [...before, ...newLines, ...after].join("\n");
  }

  public undo(currentCss: string): string {
    const last: AiEditSnapshot | undefined = this.history.pop();
    if (last === undefined) return currentCss;
    return last.css;
  }

  public getHistory(): AiEditSnapshot[] {
    return [...this.history];
  }

  public clearHistory(): void {
    this.history = [];
  }

  private saveSnapshot(css: string, toolCallId: string, mode: "rewrite" | "update"): void {
    this.history.push({
      timestamp: Date.now(),
      css,
      toolCallId,
      mode,
    });
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx jest tests/unit/agent/edit-tool.service.spec.ts --no-coverage`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/domain/agent/edit-tool.service.ts tests/unit/agent/edit-tool.service.spec.ts
git commit -m "feat: implement EditToolService with rewrite/update modes and undo history"
```

---

### Task 6: 扩展 AI 服务支持多工具

**Files:**
- Modify: `src/domain/ai/ai.service.ts`
- Create: `tests/unit/agent/ai-service-multi-tool.spec.ts`

- [ ] **Step 1: 修改 AiService 构造函数注入新服务**

在 `ai.service.ts` 中添加新的依赖注入：

```typescript
import { ReadToolService } from "../agent/read-tool.service";
import { SearchToolService } from "../agent/search-tool.service";
import { EditToolService } from "../agent/edit-tool.service";
import {
  AI_TOOL_GENERATE_CSS,
  AI_TOOL_READ_CONTENT,
  AI_TOOL_SEARCH_CONTENT,
  AI_TOOL_EDIT_REWRITE,
  AI_TOOL_EDIT_UPDATE,
  ALL_AI_TOOL_DEFINITIONS,
  CSS_GENERATE_TOOL_DEFINITION,
  AI_BASE_SYSTEM_PROMPT,
  AI_SITE_HTML_CONTEXT,
} from "../../types/ai.types";
import type {
  AiToolResult,
  AiReadResult,
  AiSearchResult,
  AiToolName,
} from "../../types/ai.types";

// 构造函数中添加：
constructor(
  @inject(DI_TOKENS.AiClientPort) private readonly aiClient: AiClientPort,
  @inject(DI_TOKENS.CssValidatorService) private readonly cssValidator: CssValidatorService,
  @inject(DI_TOKENS.ThemeService) private readonly themeService: ThemeService,
  @inject(DI_TOKENS.ThemeRenderer) private readonly themeRenderer: ThemeRenderer,
  @inject(DI_TOKENS.ReadToolService) private readonly readTool: ReadToolService,
  @inject(DI_TOKENS.SearchToolService) private readonly searchTool: SearchToolService,
  @inject(DI_TOKENS.EditToolService) private readonly editTool: EditToolService,
  @inject(DI_TOKENS.LoggerService) private readonly logger: LoggerPort,
) {}
```

- [ ] **Step 2: 修改 createSession 初始化新字段**

```typescript
public createSession(): AiChatSession {
  this.session = {
    id: crypto.randomUUID(),
    messages: [],
    state: "idle",
    currentCss: "",
    validationResults: [],
    toolResults: [],
    editHistory: [],
  };
  this.notify();
  return this.session;
}
```

- [ ] **Step 3: 修改 runConversationLoop 传入所有工具定义**

将 `tools: [CSS_GENERATE_TOOL_DEFINITION]` 替换为 `tools: ALL_AI_TOOL_DEFINITIONS`。

- [ ] **Step 4: 重写 handleToolCall 支持多工具分发**

```typescript
private async handleToolCall(toolCall: AiToolCall): Promise<void> {
  if (this.session === null) return;

  const toolName: AiToolName = toolCall.name as AiToolName;

  this.addToolResult({
    toolCallId: toolCall.id,
    toolName,
    state: "executing",
    title: this.buildToolTitle(toolCall),
    content: "",
  });
  this.notify();

  try {
    let resultContent: string;

    switch (toolName) {
      case AI_TOOL_GENERATE_CSS:
        resultContent = await this.handleGenerateCss(toolCall);
        break;
      case AI_TOOL_READ_CONTENT:
        resultContent = this.handleReadContent(toolCall);
        break;
      case AI_TOOL_SEARCH_CONTENT:
        resultContent = this.handleSearchContent(toolCall);
        break;
      case AI_TOOL_EDIT_REWRITE:
        resultContent = await this.handleEditRewrite(toolCall);
        break;
      case AI_TOOL_EDIT_UPDATE:
        resultContent = await this.handleEditUpdate(toolCall);
        break;
      default:
        resultContent = JSON.stringify({ success: false, message: `Unknown tool: ${toolName}` });
    }

    this.updateToolResult(toolCall.id, "success", resultContent);
  } catch (error: unknown) {
    const msg: string = error instanceof Error ? error.message : String(error);
    this.updateToolResult(toolCall.id, "failure", JSON.stringify({ success: false, message: msg }));
  }

  this.session.messages.push({
    role: "tool",
    content: this.getToolResultContent(toolCall.id),
    toolCallId: toolCall.id,
  });

  this.notify();
}
```

- [ ] **Step 5: 实现各工具处理方法**

```typescript
private async handleGenerateCss(toolCall: AiToolCall): Promise<string> {
  const args: { css?: string; description?: string } = this.parseArguments(toolCall.arguments);
  const css: string = args.css ?? "";
  const validationResult: CssValidationResult = this.cssValidator.validate(css);
  this.session.validationResults.push(validationResult);

  if (validationResult.valid) {
    this.session.currentCss = css;
    return JSON.stringify({ success: true, message: "CSS applied successfully. Preview refreshed." });
  }
  return JSON.stringify({
    success: false,
    errors: validationResult.errors,
    message: "CSS validation failed. Please fix the errors and try again.",
  });
}

private handleReadContent(toolCall: AiToolCall): string {
  const args: { title?: string; startLine?: number; endLine?: number } = this.parseArguments(toolCall.arguments);
  const title: string = args.title ?? "content";
  const currentCss: string = this.getCurrentCssForRead();
  const result: AiReadResult = this.readTool.read(currentCss, {
    startLine: args.startLine,
    endLine: args.endLine,
  });

  this.updateToolResultTitle(toolCall.id, this.formatReadTitle(title, result));

  return JSON.stringify({ success: true, ...result });
}

private handleSearchContent(toolCall: AiToolCall): string {
  const args: { query?: string; isRegex?: boolean; isFuzzy?: boolean } = this.parseArguments(toolCall.arguments);
  const query: string = args.query ?? "";
  const currentCss: string = this.getCurrentCssForRead();
  const result: AiSearchResult = this.searchTool.search(currentCss, {
    query,
    isRegex: args.isRegex,
    isFuzzy: args.isFuzzy,
  });

  this.updateToolResultTitle(toolCall.id, query);

  return JSON.stringify({ success: true, ...result });
}

private async handleEditRewrite(toolCall: AiToolCall): Promise<string> {
  const args: { css?: string; description?: string } = this.parseArguments(toolCall.arguments);
  const newCss: string = args.css ?? "";
  const description: string = args.description ?? "Rewrite CSS";

  const updatedCss: string = this.editTool.rewrite(this.session.currentCss, newCss, toolCall.id);
  const validationResult: CssValidationResult = this.cssValidator.validate(updatedCss);
  this.session.validationResults.push(validationResult);

  if (validationResult.valid) {
    this.session.currentCss = updatedCss;
    this.updateToolResultTitle(toolCall.id, `重写：${description}`);
    return JSON.stringify({ success: true, message: "CSS rewritten successfully. Preview refreshed." });
  }

  this.editTool.undo(updatedCss);
  this.updateToolResultTitle(toolCall.id, "编辑失败");
  return JSON.stringify({
    success: false,
    errors: validationResult.errors,
    message: "CSS validation failed after rewrite. Original CSS preserved.",
  });
}

private async handleEditUpdate(toolCall: AiToolCall): Promise<string> {
  const args: { startLine?: number; endLine?: number; newContent?: string; description?: string } = this.parseArguments(toolCall.arguments);
  const startLine: number = args.startLine ?? 0;
  const endLine: number = args.endLine ?? 0;
  const newContent: string = args.newContent ?? "";
  const description: string = args.description ?? "Update CSS";

  if (startLine < 1 || endLine < startLine) {
    this.updateToolResultTitle(toolCall.id, "编辑失败");
    return JSON.stringify({ success: false, message: "Invalid line range." });
  }

  let updatedCss: string;
  try {
    updatedCss = this.editTool.update(this.session.currentCss, startLine, endLine, newContent, toolCall.id);
  } catch (error: unknown) {
    this.updateToolResultTitle(toolCall.id, "编辑失败");
    return JSON.stringify({ success: false, message: error instanceof Error ? error.message : "Update failed." });
  }

  const validationResult: CssValidationResult = this.cssValidator.validate(updatedCss);
  this.session.validationResults.push(validationResult);

  if (validationResult.valid) {
    this.session.currentCss = updatedCss;
    this.updateToolResultTitle(toolCall.id, `更新：${description}`);
    return JSON.stringify({ success: true, message: "CSS updated successfully. Preview refreshed." });
  }

  this.editTool.undo(updatedCss);
  this.updateToolResultTitle(toolCall.id, "编辑失败");
  return JSON.stringify({
    success: false,
    errors: validationResult.errors,
    message: "CSS validation failed after update. Original CSS preserved.",
  });
}

private getCurrentCssForRead(): string {
  if (this.session !== null && this.session.currentCss.length > 0) {
    return this.session.currentCss;
  }
  const activeThemeId: string = this.themeService.getActiveTheme().id;
  return this.themeRenderer.getCSS(activeThemeId);
}

private buildToolTitle(toolCall: AiToolCall): string {
  const args: Record<string, unknown> = this.parseArguments(toolCall.arguments);
  switch (toolCall.name) {
    case AI_TOOL_READ_CONTENT:
      return `读取：${(args.title as string) ?? "content"}`;
    case AI_TOOL_SEARCH_CONTENT:
      return (args.query as string) ?? "search";
    case AI_TOOL_EDIT_REWRITE:
      return `重写：${(args.description as string) ?? "CSS"}`;
    case AI_TOOL_EDIT_UPDATE:
      return `更新：${(args.description as string) ?? "CSS"}`;
    case AI_TOOL_GENERATE_CSS:
      return "generate_css()";
    default:
      return toolCall.name;
  }
}

private formatReadTitle(title: string, result: AiReadResult): string {
  if (result.range !== undefined) {
    return `读取：${title}（${result.lineCount}行）`;
  }
  return `读取：${title}`;
}

private addToolResult(result: AiToolResult): void {
  if (this.session === null) return;
  this.session.toolResults.push(result);
}

private updateToolResult(toolCallId: string, state: AiToolState, content: string): void {
  if (this.session === null) return;
  const result: AiToolResult | undefined = this.session.toolResults.find(
    (r: AiToolResult): boolean => r.toolCallId === toolCallId,
  );
  if (result !== undefined) {
    result.state = state;
    result.content = content;
  }
}

private updateToolResultTitle(toolCallId: string, title: string): void {
  if (this.session === null) return;
  const result: AiToolResult | undefined = this.session.toolResults.find(
    (r: AiToolResult): boolean => r.toolCallId === toolCallId,
  );
  if (result !== undefined) {
    result.title = title;
  }
}

private getToolResultContent(toolCallId: string): string {
  if (this.session === null) return "";
  const result: AiToolResult | undefined = this.session.toolResults.find(
    (r: AiToolResult): boolean => r.toolCallId === toolCallId,
  );
  return result?.content ?? "";
}
```

- [ ] **Step 6: 修改验证失败循环逻辑**

在 `runConversationLoop` 中，修改验证失败后的处理逻辑，使其检查所有编辑类工具的验证结果：

```typescript
const lastValidation: CssValidationResult | undefined =
  this.session.validationResults[this.session.validationResults.length - 1];

if (lastValidation && !lastValidation.valid) {
  iterations++;
  if (iterations <= MAX_FIX_ITERATIONS) {
    this.session.messages.push({
      role: "tool",
      content: this.formatValidationErrors(lastValidation),
      toolCallId: this.findLastEditToolCallId(),
    });
    continue;
  }
}
```

同时修改 `findLastCssToolCallId` 为 `findLastEditToolCallId`，使其匹配所有编辑类工具：

```typescript
private findLastEditToolCallId(): string {
  if (this.session === null) return "";
  const editToolNames: string[] = [AI_TOOL_GENERATE_CSS, AI_TOOL_EDIT_REWRITE, AI_TOOL_EDIT_UPDATE];
  for (let i: number = this.session.messages.length - 1; i >= 0; i--) {
    const msg: AiChatMessage | undefined = this.session.messages[i];
    if (msg === undefined) continue;
    if (msg.toolCalls) {
      for (const tc of msg.toolCalls) {
        if (editToolNames.includes(tc.name)) return tc.id;
      }
    }
  }
  return "";
}
```

- [ ] **Step 7: 编写多工具集成测试**

```typescript
// tests/unit/agent/ai-service-multi-tool.spec.ts
import { AiService } from "../../../src/domain/ai/ai.service";
import type { AiClientPort } from "../../../src/domain/ports/ai-client.port";
import type { AiChatResponse, AiChatMessage } from "../../../src/types/ai.types";
import { CssValidatorService } from "../../../src/domain/ai/css-validator.service";
import { ReadToolService } from "../../../src/domain/agent/read-tool.service";
import { SearchToolService } from "../../../src/domain/agent/search-tool.service";
import { EditToolService } from "../../../src/domain/agent/edit-tool.service";

describe("AiService multi-tool integration", () => {
  let service: AiService;
  let mockAiClient: AiClientPort;

  beforeEach(() => {
    mockAiClient = {
      chat: jest.fn(),
    };
    const cssValidator = new CssValidatorService();
    const readTool = new ReadToolService();
    const searchTool = new SearchToolService();
    const editTool = new EditToolService();
    const mockThemeService = { getActiveTheme: () => ({ id: "default", name: "Default" }) };
    const mockThemeRenderer = { getCSS: () => ".garden-nav { height: 60px; }" };
    const mockLogger = { error: jest.fn(), warn: jest.fn(), info: jest.fn() };

    service = new AiService(
      mockAiClient as AiClientPort,
      cssValidator,
      mockThemeService as any,
      mockThemeRenderer as any,
      readTool,
      searchTool,
      editTool,
      mockLogger as any,
    );
  });

  it("should pass all tool definitions to AI client", async () => {
    service.createSession();
    (mockAiClient.chat as jest.Mock).mockResolvedValue({
      message: { role: "assistant", content: "Done" },
      finishReason: "stop",
    });

    await service.sendMessage("test");

    const callArgs = (mockAiClient.chat as jest.Mock).mock.calls[0][0];
    expect(callArgs.tools).toHaveLength(5);
    expect(callArgs.tools.map((t: any) => t.name)).toEqual(
      expect.arrayContaining(["generate_css", "read_content", "search_content", "edit_rewrite", "edit_update"]),
    );
  });
});
```

- [ ] **Step 8: 运行测试**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx jest tests/unit/agent/ --no-coverage`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add src/domain/ai/ai.service.ts tests/unit/agent/ai-service-multi-tool.spec.ts
git commit -m "feat: extend AiService with multi-tool support for read/search/edit"
```

---

### Task 7: 注册 DI Token 和服务

**Files:**
- Modify: `src/di/tokens.ts`
- Modify: `src/di/registrations.ts`

- [ ] **Step 1: 添加 DI Token**

在 `tokens.ts` 的 `// Domain — AI` 部分添加：

```typescript
ReadToolService: Symbol.for("ReadToolService") as InjectionToken,
SearchToolService: Symbol.for("SearchToolService") as InjectionToken,
EditToolService: Symbol.for("EditToolService") as InjectionToken,
```

- [ ] **Step 2: 注册服务**

在 `registrations.ts` 中添加导入和注册：

```typescript
import { ReadToolService } from "../domain/agent/read-tool.service";
import { SearchToolService } from "../domain/agent/search-tool.service";
import { EditToolService } from "../domain/agent/edit-tool.service";

// 在 registerInfrastructure() 中添加：
container.registerSingleton(DI_TOKENS.ReadToolService, ReadToolService);
container.registerSingleton(DI_TOKENS.SearchToolService, SearchToolService);
container.registerSingleton(DI_TOKENS.EditToolService, EditToolService);
```

- [ ] **Step 3: 验证类型检查**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx tsc --noEmit`
Expected: 无新增错误

- [ ] **Step 4: Commit**

```bash
git add src/di/tokens.ts src/di/registrations.ts
git commit -m "feat: register ReadToolService, SearchToolService, EditToolService in DI"
```

---

### Task 8: CSS 重构 — 迁移样式到 styles.css

**Files:**
- Modify: `styles.css`
- Modify: `src/presentation/components/ai-chat-panel.view.ts`

- [ ] **Step 1: 将 AI_PANEL_STYLES 迁移到 styles.css**

将 `ai-chat-panel.view.ts` 中 `AI_PANEL_STYLES` 常量的全部 CSS 内容复制到 `styles.css` 文件末尾，并添加新的工具卡片样式：

在 `styles.css` 末尾追加：

```css
/* ── AI Chat Panel ── */

.ai-panel {
  display: flex;
  flex-direction: column;
  width: 360px;
  height: 100%;
  background: var(--background-primary, #ffffff);
  border-left: 1px solid var(--background-modifier-border, #e7e5e4);
  overflow: hidden;
  font-family: var(--font-interface, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
  font-size: 13px;
  color: var(--text-normal, #1c1917);
}

.ai-panel.is-hidden {
  display: none;
}

.ai-panel.is-sliding-in {
  animation: ai-panel-slide-in 0.3s ease-out;
}

.ai-panel.is-sliding-out {
  animation: ai-panel-slide-out 0.25s ease-in;
}

@keyframes ai-panel-slide-in {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

@keyframes ai-panel-slide-out {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(100%); opacity: 0; }
}

.ai-panel-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  height: 44px;
  background: var(--background-secondary, #f2f0eb);
  border-bottom: 1px solid var(--background-modifier-border, #e7e5e4);
  flex-shrink: 0;
}

.ai-panel-header-icon {
  width: 18px;
  height: 18px;
  color: var(--text-accent, #4f46e5);
}

.ai-panel-header-title {
  font-weight: 600;
  font-size: 13px;
  color: var(--text-normal, #1c1917);
}

.ai-panel-header-spacer {
  flex: 1;
}

.ai-panel-pro-badge {
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
  height: 20px;
  border-radius: 6px;
  background: rgba(79, 70, 229, 0.08);
  color: var(--text-accent, #4f46e5);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.ai-panel-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: var(--text-muted, #a8a29e);
  transition: background 0.15s ease;
}

.ai-panel-close:hover {
  background: var(--background-modifier-hover, rgba(0,0,0,0.04));
}

.ai-panel-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ai-panel-messages::-webkit-scrollbar {
  width: 4px;
}

.ai-panel-messages::-webkit-scrollbar-thumb {
  background: var(--background-modifier-border, #e7e5e4);
  border-radius: 2px;
}

.ai-msg {
  display: flex;
  gap: 8px;
  width: 100%;
  animation: ai-msg-in 0.25s ease-out;
}

@keyframes ai-msg-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

.ai-msg-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ai-msg-avatar-user {
  background: var(--background-secondary, #f2f0eb);
  color: var(--text-muted, #78716c);
}

.ai-msg-avatar-ai {
  background: #eef2ff;
  color: var(--text-accent, #4f46e5);
}

.ai-msg-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.ai-msg-name {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-muted, #78716c);
}

.ai-msg-name-ai {
  font-size: 11px;
  font-weight: 600;
  color: var(--text-accent, #4f46e5);
}

.ai-msg-content {
  font-size: 13px;
  line-height: 1.5;
  color: var(--text-normal, #1c1917);
  word-break: break-word;
}

.ai-msg-content-sm {
  font-size: 12px;
  color: var(--text-muted, #78716c);
}

/* ── Tool Card (unified for all tools) ── */

.ai-tool-card {
  border-radius: 8px;
  background: rgba(79, 70, 229, 0.04);
  border: 1px solid rgba(79, 70, 229, 0.15);
  display: flex;
  flex-direction: column;
  animation: ai-msg-in 0.25s ease-out;
  overflow: hidden;
}

.ai-tool-card.is-success {
  background: rgba(22, 163, 74, 0.06);
  border-color: rgba(22, 163, 74, 0.2);
}

.ai-tool-card.is-failure {
  background: rgba(220, 38, 38, 0.06);
  border-color: rgba(220, 38, 38, 0.2);
}

.ai-tool-card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  cursor: pointer;
  user-select: none;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-accent, #4f46e5);
}

.ai-tool-card.is-success .ai-tool-card-header {
  color: #16a34a;
}

.ai-tool-card.is-failure .ai-tool-card-header {
  color: #dc2626;
}

.ai-tool-card-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.ai-tool-card-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ai-tool-card-toggle {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  color: var(--text-muted, #a8a29e);
  transition: transform 0.15s ease;
}

.ai-tool-card.is-expanded .ai-tool-card-toggle {
  transform: rotate(90deg);
}

.ai-tool-card-body {
  display: none;
  padding: 0 10px 10px;
}

.ai-tool-card.is-expanded .ai-tool-card-body {
  display: block;
}

.ai-tool-card-code {
  border-radius: 6px;
  background: var(--background-secondary, #f2f0eb);
  padding: 8px;
  font-family: var(--font-monospace, "SF Mono", "Fira Code", Consolas, monospace);
  font-size: 11px;
  line-height: 1.5;
  color: #4338ca;
  overflow-x: auto;
  max-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

.ai-tool-card.is-failure .ai-tool-card-code {
  color: #991b1b;
}

.ai-tool-card-search-nav {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
  font-size: 11px;
  color: var(--text-muted, #78716c);
}

.ai-tool-card-search-nav button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 1px solid var(--background-modifier-border, #e7e5e4);
  background: var(--background-primary, #ffffff);
  cursor: pointer;
  color: var(--text-normal, #1c1917);
}

.ai-tool-card-search-nav button:hover {
  background: var(--background-secondary, #f2f0eb);
}

.ai-tool-card-highlight {
  background: rgba(79, 70, 229, 0.15);
  border-radius: 2px;
  padding: 0 2px;
}

/* ── Legacy tool call (generate_css) ── */

.ai-tool-call {
  border-radius: 8px;
  background: rgba(79, 70, 229, 0.04);
  border: 1px solid rgba(79, 70, 229, 0.15);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  animation: ai-msg-in 0.25s ease-out;
}

.ai-tool-call-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--text-accent, #4f46e5);
}

.ai-tool-call-icon {
  width: 14px;
  height: 14px;
}

.ai-tool-call-code {
  border-radius: 6px;
  background: var(--background-secondary, #f2f0eb);
  padding: 8px;
  font-family: var(--font-monospace, "SF Mono", "Fira Code", Consolas, monospace);
  font-size: 11px;
  line-height: 1.5;
  color: #4338ca;
  overflow-x: auto;
  max-height: 120px;
  overflow-y: auto;
  white-space: pre-wrap;
  word-break: break-all;
}

/* ── Validation ── */

.ai-validation-error {
  border-radius: 8px;
  background: rgba(220, 38, 38, 0.06);
  border: 1px solid rgba(220, 38, 38, 0.2);
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  animation: ai-msg-in 0.25s ease-out;
}

.ai-validation-error-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: #dc2626;
}

.ai-validation-error-msg {
  font-size: 12px;
  line-height: 1.5;
  color: #991b1b;
}

.ai-validation-ok {
  border-radius: 8px;
  background: rgba(22, 163, 74, 0.06);
  border: 1px solid rgba(22, 163, 74, 0.2);
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #16a34a;
  animation: ai-msg-in 0.25s ease-out;
}

/* ── Input Area ── */

.ai-panel-input {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: var(--background-secondary, #f2f0eb);
  border-top: 1px solid var(--background-modifier-border, #e7e5e4);
  flex-shrink: 0;
}

.ai-panel-input-field {
  flex: 1;
  height: 36px;
  padding: 0 10px;
  border: 1.5px solid var(--background-modifier-border, #e7e5e4);
  border-radius: 10px;
  background: var(--background-primary, #ffffff);
  color: var(--text-normal, #1c1917);
  font-size: 13px;
  font-family: var(--font-interface, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}

.ai-panel-input-field:focus {
  border-color: var(--text-accent, #4f46e5);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.12);
}

.ai-panel-input-field::placeholder {
  color: var(--text-faint, #a8a29e);
}

.ai-panel-send {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: var(--text-accent, #4f46e5);
  color: #ffffff;
  cursor: pointer;
  transition: background 0.15s ease, opacity 0.15s ease;
  flex-shrink: 0;
}

.ai-panel-send:hover {
  background: var(--text-accent-hover, #4338ca);
}

.ai-panel-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* ── Loading ── */

.ai-panel-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 12px;
  color: var(--text-muted, #78716c);
  animation: ai-msg-in 0.25s ease-out;
}

.ai-panel-loading-dots {
  display: flex;
  gap: 3px;
}

.ai-panel-loading-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--text-muted, #a8a29e);
  animation: ai-dot-pulse 1.2s ease-in-out infinite;
}

.ai-panel-loading-dot:nth-child(2) { animation-delay: 0.2s; }
.ai-panel-loading-dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes ai-dot-pulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

/* ── Empty State ── */

.ai-panel-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 40px 20px;
  color: var(--text-faint, #a8a29e);
  text-align: center;
}

.ai-panel-empty-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #eef2ff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-accent, #4f46e5);
}

.ai-panel-empty-text {
  font-size: 13px;
  line-height: 1.5;
  max-width: 260px;
}

/* ── Utility Classes ── */

.is-hidden {
  display: none !important;
}
```

- [ ] **Step 2: 从 ai-chat-panel.view.ts 移除 AI_PANEL_STYLES 常量和 injectStyles 方法**

删除 `AI_PANEL_STYLES` 常量（L9-L353）和 `injectStyles()` 方法（L647-L653），以及 `render()` 方法中创建 style 元素的代码（L427-L438）。

- [ ] **Step 3: 用 CSS class 替代内联 style 操作**

修改 `open()` 和 `close()` 方法：

```typescript
public open(): void {
  this.isOpen = true;
  this.containerEl.removeClass("is-hidden");
  this.containerEl.addClass("is-sliding-in");
  this.containerEl.removeClass("is-sliding-out");
  if (this.aiService.getSession() === null) {
    this.aiService.createSession();
  }
  this.inputField?.focus();
}

public close(): void {
  this.isOpen = false;
  this.containerEl.removeClass("is-sliding-in");
  this.containerEl.addClass("is-sliding-out");
  setTimeout((): void => {
    if (!this.isOpen) {
      this.containerEl.addClass("is-hidden");
    }
  }, 250);
}
```

- [ ] **Step 4: 验证构建**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 5: Commit**

```bash
git add styles.css src/presentation/components/ai-chat-panel.view.ts
git commit -m "refactor: migrate AI panel styles to styles.css, remove inline styles and injectStyles"
```

---

### Task 9: 重构 AI 面板 UI — 使用 lucide 图标和工具卡片

**Files:**
- Modify: `src/presentation/components/ai-chat-panel.view.ts`

- [ ] **Step 1: 替换所有内联 SVG 为 lucide 图标**

修改 `ai-chat-panel.view.ts` 的导入：

```typescript
import { icon, ICONS } from "../../shared/icons";
import type { AiToolResult, AiToolName } from "../../types/ai.types";
import {
  AI_TOOL_GENERATE_CSS,
  AI_TOOL_READ_CONTENT,
  AI_TOOL_SEARCH_CONTENT,
  AI_TOOL_EDIT_REWRITE,
  AI_TOOL_EDIT_UPDATE,
} from "../../types/ai.types";
```

- [ ] **Step 2: 替换 renderHeader 中的图标**

```typescript
private renderHeader(): void {
  const header: HTMLElement = this.containerEl.createDiv({ cls: "ai-panel-header" });

  const iconEl: HTMLElement = header.createDiv({ cls: "ai-panel-header-icon" });
  iconEl.innerHTML = icon("bot", 18);

  header.createSpan({ cls: "ai-panel-header-title", text: "AI Assistant" });
  header.createDiv({ cls: "ai-panel-header-spacer" });

  const closeBtn: HTMLButtonElement = header.createEl("button", { cls: "ai-panel-close" });
  closeBtn.innerHTML = icon("close", 16);
  closeBtn.addEventListener("click", (): void => {
    this.close();
  });
}
```

- [ ] **Step 3: 替换 renderEmptyState 中的图标**

```typescript
private renderEmptyState(): void {
  this.messagesEl.empty();
  const empty: HTMLElement = this.messagesEl.createDiv({ cls: "ai-panel-empty" });
  const iconWrap: HTMLElement = empty.createDiv({ cls: "ai-panel-empty-icon" });
  iconWrap.innerHTML = icon("bot", 20);
  empty.createDiv({ cls: "ai-panel-empty-text", text: "Ask AI to modify your site styles.\nFor example: \"Make the header background blue\"" });
}
```

- [ ] **Step 4: 替换 renderInputArea 中的图标**

```typescript
this.sendBtn.innerHTML = icon("send", 16);
```

- [ ] **Step 5: 替换 renderUserMessage 和 renderAssistantMessage 中的图标**

```typescript
private renderUserMessage(msg: AiChatMessage): void {
  const msgEl: HTMLElement = this.messagesEl.createDiv({ cls: "ai-msg" });
  const avatar: HTMLElement = msgEl.createDiv({ cls: "ai-msg-avatar ai-msg-avatar-user" });
  avatar.innerHTML = icon("user", 14);
  const body: HTMLElement = msgEl.createDiv({ cls: "ai-msg-body" });
  body.createDiv({ cls: "ai-msg-name", text: "You" });
  body.createDiv({ cls: "ai-msg-content", text: msg.content });
}

private renderAssistantMessage(msg: AiChatMessage): void {
  const msgEl: HTMLElement = this.messagesEl.createDiv({ cls: "ai-msg" });
  const avatar: HTMLElement = msgEl.createDiv({ cls: "ai-msg-avatar ai-msg-avatar-ai" });
  avatar.innerHTML = icon("bot", 14);
  const body: HTMLElement = msgEl.createDiv({ cls: "ai-msg-body" });
  body.createDiv({ cls: "ai-msg-name-ai", text: "AI" });
  body.createDiv({ cls: "ai-msg-content", text: msg.content });
}
```

- [ ] **Step 6: 替换 renderValidationResult 中的图标**

```typescript
private renderValidationResult(result: CssValidationResult): void {
  if (result.valid) {
    const okEl: HTMLElement = this.messagesEl.createDiv({ cls: "ai-validation-ok" });
    okEl.innerHTML = icon("check", 16);
    okEl.createSpan({ text: "CSS valid — Preview refreshed" });
  } else {
    const errEl: HTMLElement = this.messagesEl.createDiv({ cls: "ai-validation-error" });
    const header: HTMLElement = errEl.createDiv({ cls: "ai-validation-error-header" });
    header.innerHTML = icon("alert", 14);
    header.createSpan({ text: "Validation Error" });
    for (const error of result.errors) {
      const msgEl: HTMLElement = errEl.createDiv({ cls: "ai-validation-error-msg" });
      msgEl.textContent = error.message;
    }
  }
}
```

- [ ] **Step 7: 实现统一工具卡片渲染**

替换现有的 `renderToolCall` 方法，添加新的 `renderToolCard` 方法：

```typescript
private renderToolCall(toolCall: { id: string; name: string; arguments: string }): void {
  if (toolCall.name === AI_TOOL_GENERATE_CSS) {
    this.renderLegacyToolCall(toolCall);
    return;
  }

  const toolResult: AiToolResult | undefined = this.currentSession?.toolResults.find(
    (r: AiToolResult): boolean => r.toolCallId === toolCall.id,
  );

  this.renderToolCard(toolCall, toolResult);
}

private getToolIcon(toolName: AiToolName): string {
  switch (toolName) {
    case AI_TOOL_READ_CONTENT:
      return icon("fileSearch", 16);
    case AI_TOOL_SEARCH_CONTENT:
      return icon("search", 16);
    case AI_TOOL_EDIT_REWRITE:
      return icon("editRewrite", 16);
    case AI_TOOL_EDIT_UPDATE:
      return icon("editUpdate", 16);
    default:
      return icon("wrench", 16);
  }
}

private renderToolCard(
  toolCall: { id: string; name: string; arguments: string },
  toolResult: AiToolResult | undefined,
): void {
  const stateClass: string = toolResult?.state === "success" ? "is-success"
    : toolResult?.state === "failure" ? "is-failure" : "";

  const card: HTMLElement = this.messagesEl.createDiv({
    cls: `ai-tool-card ${stateClass}`.trim(),
  });

  const header: HTMLElement = card.createDiv({ cls: "ai-tool-card-header" });
  header.innerHTML = this.getToolIcon(toolCall.name as AiToolName);

  const title: string = toolResult?.title ?? toolCall.name;
  header.createSpan({ cls: "ai-tool-card-title", text: title });

  const toggle: HTMLElement = header.createDiv({ cls: "ai-tool-card-toggle" });
  toggle.innerHTML = icon("chevronRight", 14);

  if (toolResult?.state === "executing") {
    const spinner: HTMLElement = header.createDiv({ cls: "ai-tool-card-icon" });
    spinner.innerHTML = icon("loader", 14);
    spinner.style.animation = "ai-dot-pulse 1.2s ease-in-out infinite";
  }

  const body: HTMLElement = card.createDiv({ cls: "ai-tool-card-body" });

  if (toolResult?.state !== "failure") {
    let content: string = "";
    try {
      const args: Record<string, string | undefined> = JSON.parse(toolCall.arguments) as Record<string, string | undefined>;
      content = args.css ?? args.newContent ?? args.query ?? "";
    } catch {
      content = toolCall.arguments;
    }

    if (content.length > 0) {
      const codeEl: HTMLElement = body.createDiv({ cls: "ai-tool-card-code" });
      codeEl.textContent = content.length > 500 ? content.substring(0, 500) + "\n..." : content;
    }

    if (toolResult?.state === "success" && toolResult.content) {
      try {
        const resultData: Record<string, unknown> = JSON.parse(toolResult.content) as Record<string, unknown>;
        if (resultData.matches && Array.isArray(resultData.matches)) {
          this.renderSearchResults(body, resultData);
        }
      } catch {
        // not JSON, skip
      }
    }
  }

  header.addEventListener("click", (): void => {
    card.toggleClass("is-expanded", !card.hasClass("is-expanded"));
  });
}

private renderSearchResults(body: HTMLElement, resultData: Record<string, unknown>): void {
  const matches: Array<Record<string, unknown>> = resultData.matches as Array<Record<string, unknown>>;
  const total: number = typeof resultData.totalMatches === "number" ? resultData.totalMatches : matches.length;

  const nav: HTMLElement = body.createDiv({ cls: "ai-tool-card-search-nav" });
  nav.createSpan({ text: `${total} matches` });

  if (matches.length > 0) {
    const codeEl: HTMLElement = body.createDiv({ cls: "ai-tool-card-code" });
    const lines: string[] = matches.map(
      (m: Record<string, unknown>, i: number): string =>
        `L${m.line ?? i + 1}: ${String(m.text ?? "").substring(0, 80)}`,
    );
    codeEl.textContent = lines.join("\n");
  }
}

private renderLegacyToolCall(toolCall: { id: string; name: string; arguments: string }): void {
  const toolEl: HTMLElement = this.messagesEl.createDiv({ cls: "ai-tool-call" });

  const header: HTMLElement = toolEl.createDiv({ cls: "ai-tool-call-header" });
  header.innerHTML = icon("wrench", 14);
  header.createSpan({ text: "generate_css()" });

  let cssContent: string;
  let description: string | undefined;
  try {
    const args: Record<string, string | undefined> = JSON.parse(toolCall.arguments) as Record<string, string | undefined>;
    cssContent = args.css ?? "";
    description = args.description;
  } catch {
    cssContent = toolCall.arguments;
    description = undefined;
  }

  if (description !== undefined) {
    const desc: HTMLElement = toolEl.createDiv({ cls: "ai-msg-content ai-msg-content-sm" });
    desc.textContent = description;
  }

  if (cssContent.length > 0) {
    const codeEl: HTMLElement = toolEl.createDiv({ cls: "ai-tool-call-code" });
    codeEl.textContent = cssContent.length > 500 ? cssContent.substring(0, 500) + "\n..." : cssContent;
  }
}
```

- [ ] **Step 8: 添加 currentSession 引用**

在类中添加属性：

```typescript
private currentSession: AiChatSession | null = null;
```

修改 `onSessionUpdate` 方法：

```typescript
private onSessionUpdate(session: AiChatSession): void {
  this.currentSession = session;
  this.renderMessages(session);
  this.sendBtn.disabled = session.state === "loading" || session.state === "streaming";
  if (session.currentCss.length > 0 && this.onCssApply !== null) {
    this.onCssApply(session.currentCss);
  }
  this.scrollToBottom();
}
```

- [ ] **Step 9: 验证构建**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 10: Commit**

```bash
git add src/presentation/components/ai-chat-panel.view.ts
git commit -m "feat: refactor AI panel UI with lucide icons and unified tool card component"
```

---

### Task 10: 更新 publish-wizard.view.ts 中的 AI 图标

**Files:**
- Modify: `src/presentation/components/publish-wizard.view.ts`

- [ ] **Step 1: 替换 AI 切换按钮中的 SVG**

找到 AI toggle 按钮中的内联 SVG（约 L525），替换为 lucide 图标：

```typescript
import { icon } from "../../shared/icons";

// 替换 AI toggle 按钮中的 SVG
aiToggleBtn.innerHTML = icon("bot", 16);
```

- [ ] **Step 2: 验证构建**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 3: Commit**

```bash
git add src/presentation/components/publish-wizard.view.ts
git commit -m "refactor: replace inline SVG with lucide icon in publish wizard AI toggle"
```

---

### Task 11: 全量构建验证与类型检查

**Files:**
- All modified files

- [ ] **Step 1: 运行完整类型检查**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx tsc --noEmit`
Expected: 无错误

- [ ] **Step 2: 运行 lint**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx eslint src/ --ext .ts`
Expected: 无新增错误

- [ ] **Step 3: 运行全部测试**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npx jest --no-coverage`
Expected: 所有测试通过

- [ ] **Step 4: 运行构建**

Run: `cd e:\ampa_migra\D\Games\Projec\hackathon\obsidian-garden && npm run build`
Expected: 构建成功

- [ ] **Step 5: Commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: resolve type errors and lint issues from integration"
```

---

### Task 12: 创建 agent 模块索引文件

**Files:**
- Create: `src/domain/agent/index.ts`

- [ ] **Step 1: 创建索引文件**

```typescript
// src/domain/agent/index.ts
export { ReadToolService } from "./read-tool.service";
export { SearchToolService } from "./search-tool.service";
export { EditToolService } from "./edit-tool.service";
```

- [ ] **Step 2: Commit**

```bash
git add src/domain/agent/index.ts
git commit -m "feat: add agent module index file"
```

---

## Self-Review Checklist

### Spec Coverage

| Requirement | Task |
|-------------|------|
| 重写和更新两种编辑模式 | Task 5 (EditToolService), Task 6 (AiService) |
| 专属图标24x24px | Task 1 (lucide), Task 9 (UI) |
| 功能描述区域标注特性 | Task 9 (tool card header) |
| 编辑状态实时保存 | Task 5 (edit history/undo) |
| 语法校验自动报告 | Task 6 (validation in handleToolCall) |
| 读取工具局部/全部模式 | Task 3 (ReadToolService) |
| 智能行号解析 | Task 3 (parseLineRange) |
| 读取工具模态对话框UI | Task 9 (renderToolCard) |
| 读取标题动态生成 | Task 6 (formatReadTitle) |
| 搜索工具关键词/正则 | Task 4 (SearchToolService) |
| 搜索工具UI | Task 9 (renderToolCard + renderSearchResults) |
| 搜索结果高亮与定位 | Task 9 (highlight + search nav) |
| 搜索结果统计 | Task 9 (total matches display) |
| 工具3态（执行中/成功/失败） | Task 9 (tool card state classes) |
| CSS重构移除内联样式 | Task 8 (styles.css migration) |
| 使用图标库 | Task 1 (lucide-static) |
| 响应式布局 | Task 8 (CSS utility classes) |
| 单元测试 | Tasks 3, 4, 5, 6 |
| 性能<300ms | Task 4 (performance test) |

### Placeholder Scan

No TBD/TODO/placeholders found.

### Type Consistency

- `AiToolResult` defined in Task 2, used consistently in Tasks 6 and 9
- `AiReadResult` defined in Task 2, used in Tasks 3 and 6
- `AiSearchResult` defined in Task 2, used in Tasks 4 and 6
- `AiEditSnapshot` defined in Task 2, used in Tasks 5 and 6
- `AiToolName` type union defined in Task 2, used in Tasks 6 and 9
- `icon()` function signature consistent across Tasks 1, 9, 10
