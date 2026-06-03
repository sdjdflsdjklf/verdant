/**
 * Mock for the `obsidian` module.
 *
 * Obsidian is a type-only package at runtime — it has no valid Node.js
 * entry point, so Jest cannot resolve it. This file provides the minimal
 * runtime exports that the source code actually uses, so other modules
 * (especially infrastructure and DI registrations) can be loaded in tests.
 */

export const MarkdownRenderer = {
  render: (): Promise<void> => Promise.resolve(),
};

export class Component {
  load(): void { /* noop */ }
  unload(): void { /* noop */ }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Plugin {}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Notice {
  constructor(_message: string) { /* noop */ }
}
