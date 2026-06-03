import { Memoize } from "./memoize.decorator";

describe("Memoize decorator", (): void => {
  describe("instance methods", (): void => {
    class DataService {
      public callCount = 0;

      @Memoize(5000)
      public getData(id: string): string {
        this.callCount++;
        return `data-${id}`;
      }
    }

    it("should cache results for same arguments", (): void => {
      const service = new DataService();
      const r1 = service.getData("a");
      const r2 = service.getData("a");

      expect(r1).toBe("data-a");
      expect(r2).toBe("data-a");
      expect(service.callCount).toBe(1);
    });

    it("should compute fresh result for different arguments", (): void => {
      const service = new DataService();
      service.getData("a");
      service.getData("b");

      expect(service.callCount).toBe(2);
    });

    it("should have separate caches per instance", (): void => {
      const s1 = new DataService();
      const s2 = new DataService();

      s1.getData("x");
      s2.getData("x");

      expect(s1.callCount).toBe(1);
      expect(s2.callCount).toBe(1);
    });
  });

  describe("TTL expiry", (): void => {
    beforeAll((): void => {
      jest.useFakeTimers();
    });

    afterAll((): void => {
      jest.useRealTimers();
    });

    class ExpiringService {
      public callCount = 0;

      @Memoize(50)
      public getValue(): string {
        this.callCount++;
        return "value";
      }
    }

    it("should expire cache after TTL", (): void => {
      const service = new ExpiringService();
      service.getValue();
      service.getValue();
      expect(service.callCount).toBe(1);

      jest.advanceTimersByTime(60);

      service.getValue();
      expect(service.callCount).toBe(2);
    });
  });

  describe("MemoizeOptions", (): void => {
    class OptionsService {
      public callCount = 0;

      @Memoize({ ttlMs: 5000, maxEntries: 3 })
      public getData(id: string): string {
        this.callCount++;
        return `data-${id}`;
      }
    }

    it("should accept MemoizeOptions object", (): void => {
      const service = new OptionsService();
      const r1 = service.getData("a");
      const r2 = service.getData("a");

      expect(r1).toBe("data-a");
      expect(r2).toBe("data-a");
      expect(service.callCount).toBe(1);
    });

    it("should evict LRU entry when maxEntries exceeded", (): void => {
      const service = new OptionsService();

      service.getData("a");
      service.getData("b");
      service.getData("c");
      expect(service.callCount).toBe(3);

      service.getData("d");
      expect(service.callCount).toBe(4);

      service.getData("a");
      expect(service.callCount).toBe(5);
    });

    it("should promote recently accessed entries", (): void => {
      const service = new OptionsService();

      service.getData("a");
      service.getData("b");
      service.getData("c");
      expect(service.callCount).toBe(3);

      service.getData("a");
      expect(service.callCount).toBe(3);

      service.getData("d");
      expect(service.callCount).toBe(4);

      service.getData("a");
      expect(service.callCount).toBe(4);
    });
  });

  describe("edge cases", (): void => {
    it("should handle non-function descriptor values", (): void => {
      const descriptor: PropertyDescriptor = { value: 42 };
      const result = Memoize()({}, "test", descriptor);
      expect(result).toBe(descriptor);
    });

    it("should use static cache when this is not an object", (): void => {
      let callCount = 0;

      class NoThisService {
        @Memoize(5000)
        public getData(id: string): string {
          callCount++;
          return `data-${id}`;
        }
      }

      const service = new NoThisService();
      const detached: (this: unknown, id: string) => string = service.getData;

      const result1 = detached.call(undefined, "a");
      const result2 = detached.call(undefined, "a");
      expect(result1).toBe("data-a");
      expect(result2).toBe("data-a");
      expect(callCount).toBe(1);
    });
  });
});