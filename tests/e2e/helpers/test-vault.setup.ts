import type { PublishFile } from "../../../src/types/publisher.types";
import { sha256 } from "../../../src/shared/utils/crypto.utils";

export const VAULT_PATH: string = "/test-vault";

export interface TestVaultNote {
  relativePath: string;
  title: string;
  tags: string[];
  body: string;
  mtime?: number;
}

export function createTestNote(
  relativePath: string,
  title: string,
  tags: string[] = [],
  extraBody: string = "",
): TestVaultNote {
  return {
    relativePath,
    title,
    tags,
    body: extraBody,
  };
}

function buildMarkdownContent(note: TestVaultNote): string {
  const tagStr: string = note.tags.length > 0
    ? `tags: [${note.tags.join(", ")}]`
    : "";

  const frontmatterLines: string[] = ["---", `title: ${note.title}`];
  if (tagStr.length > 0) {
    frontmatterLines.push(tagStr);
  }
  frontmatterLines.push("---");

  const bodyParts: string[] = [`# ${note.title}`];
  if (note.body.length > 0) {
    bodyParts.push(note.body);
  }

  return `${frontmatterLines.join("\n")}\n\n${bodyParts.join("\n\n")}`;
}

export function createTestVault(): TestVaultNote[] {
  return [
    createTestNote(
      "notes/welcome.md",
      "Welcome",
      ["intro"],
      "Welcome to your digital garden!",
    ),
    createTestNote(
      "notes/projects.md",
      "Projects",
      ["dev", "meta"],
      "## Current Projects\n\n- Project A\n- Project B",
    ),
    createTestNote(
      "notes/ideas.md",
      "Ideas",
      ["creative"],
      "Random thoughts and inspiration.",
    ),
    createTestNote(
      "notes/recipes.md",
      "Recipes",
      ["personal", "cooking"],
      "## Pasta\n\nBoil water, add pasta, cook for 10 minutes.",
    ),
    createTestNote(
      "notes/bookmarks.md",
      "Bookmarks",
      ["reference"],
      "Useful links and resources.",
    ),
  ];
}

export async function toPublishFile(
  note: TestVaultNote,
): Promise<PublishFile> {
  const content: string = buildMarkdownContent(note);
  const hash: string = await sha256(content);
  return {
    relativePath: note.relativePath,
    absolutePath: `${VAULT_PATH}/${note.relativePath}`,
    content,
    hash,
    mtime: note.mtime ?? Date.now(),
  };
}
