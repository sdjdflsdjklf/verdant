import { Log, LogDecorator } from "./log.decorator";

describe("Log decorator", (): void => {
  let consoleSpy: jest.SpyInstance;

  beforeAll((): void => {
    LogDecorator.enabled = true;
  });

  beforeEach((): void => {
    consoleSpy = jest.spyOn(console, "debug").mockImplementation();
  });

  afterEach((): void => {
    consoleSpy.mockRestore();
  });

  class TestService {
    @Log()
    public syncMethod(value: string): string {
      return `hello ${value}`;
    }

    @Log()
    public async asyncMethod(value: string): Promise<string> {
      return `async ${value}`;
    }

    @Log()
    public throwingMethod(): never {
      throw new Error("oops");
    }
  }

  it("should log sync method entry and exit", (): void => {
    const service = new TestService();
    const result = service.syncMethod("world");

    expect(result).toBe("hello world");
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });

  it("should log async method entry and exit", async (): Promise<void> => {
    const service = new TestService();
    const result = await service.asyncMethod("test");

    expect(result).toBe("async test");
    // First call is entry, second is the .then handler
    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });

  it("should log errors", (): void => {
    const service = new TestService();

    expect((): void => {
      service.throwingMethod();
    }).toThrow("oops");

    expect(consoleSpy).toHaveBeenCalledTimes(2);
  });

  it("should skip logging when disabled", (): void => {
    LogDecorator.enabled = false;

    const service = new TestService();
    const result = service.syncMethod("world");

    expect(result).toBe("hello world");
    expect(consoleSpy).not.toHaveBeenCalled();

    LogDecorator.enabled = true;
  });

  it("should handle non-function descriptor values", (): void => {
    const descriptor: PropertyDescriptor = { value: true };
    const result = Log()({}, "test", descriptor);
    expect(result).toBe(descriptor);
  });

  it("should log async method rejection", async (): Promise<void> => {
    const consoleSpyAsync = jest.spyOn(console, "debug").mockImplementation();

    class FailingService {
      @Log()
      public async fail(): Promise<never> {
        throw new Error("async fail");
      }
    }

    const service = new FailingService();
    await expect(service.fail()).rejects.toThrow("async fail");
    expect(consoleSpyAsync).toHaveBeenCalledTimes(2);

    consoleSpyAsync.mockRestore();
  });

  it("should sanitize null and undefined args", (): void => {
    class NullishService {
      @Log()
      public accept(val: unknown): unknown {
        return val;
      }
    }

    const service = new NullishService();
    expect(service.accept(null)).toBeNull();
    expect(service.accept(undefined)).toBeUndefined();
  });

  it("should sanitize array args", (): void => {
    class ArrayService {
      @Log()
      public process(items: unknown[]): unknown[] {
        return items;
      }
    }

    const service = new ArrayService();
    const result = service.process([1, 2, 3]);
    expect(result).toEqual([1, 2, 3]);
  });

  it("should sanitize large object args", (): void => {
    class LargeObjectService {
      @Log()
      public save(obj: Record<string, unknown>): Record<string, unknown> {
        return obj;
      }
    }

    const service = new LargeObjectService();
    const result = service.save({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 });
    expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4, e: 5, f: 6 });
  });

  it("should sanitize small object args (≤5 keys)", (): void => {
    class SmallObjectService {
      @Log()
      public save(obj: Record<string, unknown>): Record<string, unknown> {
        return obj;
      }
    }

    const service = new SmallObjectService();
    const result = service.save({ a: 1, b: 2, c: 3 });
    expect(result).toEqual({ a: 1, b: 2, c: 3 });
  });
});
