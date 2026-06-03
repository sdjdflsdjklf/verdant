import { SettingsRenderer } from "./settings-renderer";

describe("SettingsRenderer (stub)", (): void => {
  it("display should not throw", (): void => {
    const renderer = new SettingsRenderer();
    expect((): void => {
      renderer.display();
    }).not.toThrow();
  });
});
