import { Retry } from "./retry.decorator";

describe("Retry decorator", (): void => {
  class TestService {
    private callCount = 0;

    @Retry({ retries: 2, baseDelayMs: 10 })
    public async unstableMethod(): Promise<string> {
      this.callCount++;
      if (this.callCount < 3) {
        throw new Error(`Attempt ${this.callCount} failed`);
      }
      return "success";
    }

    @Retry({ retries: 3, baseDelayMs: 10 })
    public async alwaysFails(): Promise<string> {
      throw new Error("always fails");
    }

    public getCallCount(): number {
      return this.callCount;
    }
  }

  it("should retry and eventually succeed", async (): Promise<void> => {
    const service = new TestService();
    const result = await service.unstableMethod();
    expect(result).toBe("success");
    expect(service.getCallCount()).toBe(3);
  });

  it("should throw after exhausting retries", async (): Promise<void> => {
    const service = new TestService();
    await expect(service.alwaysFails()).rejects.toThrow("always fails");
  });

  it("should handle non-function descriptor values", (): void => {
    const descriptor: PropertyDescriptor = { value: "not a function" };
    const result = Retry({ retries: 1 })({}, "test", descriptor);
    expect(result).toBe(descriptor);
  });
});
