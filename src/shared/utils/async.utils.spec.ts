import {
  retry,
  timeout,
  sleep,
  AsyncQueue,
  withAbort,
  TimeoutError,
  AbortError,
} from "./async.utils";

describe("async.utils", (): void => {
  describe("retry", (): void => {
    it("should succeed on first attempt", async (): Promise<void> => {
      const fn = jest.fn().mockResolvedValue("ok");
      const result = await retry(fn, { retries: 3 });
      expect(result).toBe("ok");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should retry on failure and eventually succeed", async (): Promise<void> => {
      const fn = jest
        .fn()
        .mockRejectedValueOnce(new Error("fail"))
        .mockRejectedValueOnce(new Error("fail"))
        .mockResolvedValue("ok");

      const result = await retry(fn, { retries: 3, baseDelayMs: 10 });
      expect(result).toBe("ok");
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it("should throw after exhausting retries", async (): Promise<void> => {
      const error = new Error("persistent");
      const fn = jest.fn().mockRejectedValue(error);

      await expect(retry(fn, { retries: 2, baseDelayMs: 10 })).rejects.toThrow(
        "persistent",
      );
      expect(fn).toHaveBeenCalledTimes(3);
    });

    it("should not retry if shouldRetry returns false", async (): Promise<void> => {
      const fn = jest.fn().mockRejectedValue(new Error("fatal"));

      await expect(
        retry(fn, {
          retries: 3,
          baseDelayMs: 10,
          shouldRetry: (): boolean => false,
        }),
      ).rejects.toThrow("fatal");
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it("should use default options", async (): Promise<void> => {
      const fn = jest.fn().mockResolvedValue("defaults");
      const result = await retry(fn, { retries: 1 });
      expect(result).toBe("defaults");
    });
  });

  describe("timeout", (): void => {
    it("should resolve if promise completes in time", async (): Promise<void> => {
      const result = await timeout(Promise.resolve("done"), 1000);
      expect(result).toBe("done");
    });

    it("should reject with TimeoutError if promise is too slow", async (): Promise<void> => {
      const slow = sleep(5000);
      await expect(timeout(slow, 10)).rejects.toThrow(TimeoutError);
    });

    it("should handle timer being undefined in finally block", async (): Promise<void> => {
      const setTimeoutSpy = jest
        .spyOn(global, "setTimeout")
        .mockImplementationOnce((): ReturnType<typeof setTimeout> => {
          return undefined as unknown as ReturnType<typeof setTimeout>;
        });

      const result = await timeout(Promise.resolve("ok"), 1000);
      expect(result).toBe("ok");

      setTimeoutSpy.mockRestore();
    });
  });

  describe("sleep", (): void => {
    it("should resolve after specified time", async (): Promise<void> => {
      const start = Date.now();
      await sleep(50);
      expect(Date.now() - start).toBeGreaterThanOrEqual(45);
    });
  });

  describe("AsyncQueue", (): void => {
    it("should execute tasks sequentially", async (): Promise<void> => {
      const queue = new AsyncQueue();
      const order: number[] = [];

      const task1 = queue.enqueue(async (): Promise<void> => {
        await sleep(30);
        order.push(1);
      });
      const task2 = queue.enqueue(async (): Promise<void> => {
        order.push(2);
      });

      await task1;
      await task2;

      expect(order).toEqual([1, 2]);
    });

    it("should handle errors without crashing the queue", async (): Promise<void> => {
      const queue = new AsyncQueue();
      const order: number[] = [];

      const task1 = queue.enqueue(async (): Promise<void> => {
        throw new Error("task1 failed");
      });
      const task2 = queue.enqueue(async (): Promise<void> => {
        order.push(2);
      });

      await expect(task1).rejects.toThrow("task1 failed");
      await task2;
      expect(order).toEqual([2]);
    });
  });

  describe("withAbort", (): void => {
    it("should resolve normally if not aborted", async (): Promise<void> => {
      const controller = new AbortController();
      const result = await withAbort(Promise.resolve("ok"), controller.signal);
      expect(result).toBe("ok");
    });

    it("should reject with AbortError if already aborted", async (): Promise<void> => {
      const controller = new AbortController();
      controller.abort();
      await expect(
        withAbort(Promise.resolve("ok"), controller.signal),
      ).rejects.toThrow(AbortError);
    });

    it("should abort mid-flight when signal is triggered", async (): Promise<void> => {
      const controller = new AbortController();
      let timer: ReturnType<typeof setTimeout> | undefined;

      const promise = withAbort(
        new Promise<string>((resolve): void => {
          timer = setTimeout((): void => resolve("never"), 1000);
        }),
        controller.signal,
      );

      controller.abort();

      await expect(promise).rejects.toThrow(AbortError);
      if (timer !== undefined) {
        clearTimeout(timer);
      }
    });

    it("should handle promise rejection", async (): Promise<void> => {
      const controller = new AbortController();
      const fn = async (): Promise<never> => {
        throw new Error("network error");
      };

      const promise = withAbort(fn(), controller.signal);
      await expect(promise).rejects.toThrow("network error");
    });
  });
});
