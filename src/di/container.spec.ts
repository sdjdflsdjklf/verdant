import "reflect-metadata";
import { container } from "./container";
import { DI_TOKENS } from "./tokens";

describe("DI Container", () => {
  it("should be initialized", () => {
    expect(container).toBeDefined();
  });

  it("should allow registration and resolution", () => {
    // Register a simple mock
    class MockService {
      greet(): string {
        return "hello";
      }
    }

    container.registerSingleton(DI_TOKENS.LoggerService, MockService);
    const resolved = container.resolve<MockService>(DI_TOKENS.LoggerService);
    expect(resolved.greet()).toBe("hello");

    // Cleanup
    container.clearInstances();
  });
});
