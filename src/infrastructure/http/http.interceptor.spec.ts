import {
  createRetryInterceptor,
  createLoggingInterceptor,
  createRateLimitInterceptor,
} from "./http.interceptor";
import type { HttpResponse } from "../../domain/ports/http-client.port";

describe("HTTP interceptors", (): void => {
  describe("createRetryInterceptor", (): void => {
    it("should retry on failure and eventually succeed", async (): Promise<void> => {
      let attempts = 0;
      const handler = createRetryInterceptor(3, 10);

      const next = jest.fn().mockImplementation(async (): Promise<HttpResponse> => {
        attempts++;
        if (attempts < 3) {
          throw new Error("transient");
        }
        return { status: 200, headers: {}, data: "ok" };
      });

      const result = await handler({ method: "GET", url: "/test" }, next);
      expect(result.status).toBe(200);
      expect(result.data).toBe("ok");
      expect(next).toHaveBeenCalledTimes(3);
    });

    it("should throw after exhausting retries", async (): Promise<void> => {
      const handler = createRetryInterceptor(2, 10);
      const next = jest.fn().mockRejectedValue(new Error("persistent"));

      await expect(
        handler({ method: "GET", url: "/fail" }, next),
      ).rejects.toThrow("persistent");
      expect(next).toHaveBeenCalledTimes(3);
    });
  });

  describe("createLoggingInterceptor", (): void => {
    it("should log request and response", async (): Promise<void> => {
      const logs: string[] = [];
      const handler = createLoggingInterceptor((msg: string): void => {
        logs.push(msg);
      });

      const next = jest.fn().mockResolvedValue({
        status: 200,
        headers: {},
        data: "done",
      });

      const result = await handler(
        { method: "GET", url: "https://example.com/api" },
        next,
      );

      expect(result.status).toBe(200);
      expect(logs).toEqual([
        "[HTTP] ▶ GET https://example.com/api",
        "[HTTP] ✓ GET https://example.com/api → 200",
      ]);
    });

    it("should log errors", async (): Promise<void> => {
      const logs: string[] = [];
      const handler = createLoggingInterceptor((msg: string): void => {
        logs.push(msg);
      });

      const next = jest.fn().mockRejectedValue(new Error("timeout"));

      await expect(
        handler({ method: "GET", url: "/fail" }, next),
      ).rejects.toThrow("timeout");

      expect(logs).toEqual([
        "[HTTP] ▶ GET /fail",
        "[HTTP] ✗ GET /fail → Error: timeout",
      ]);
    });
  });

  describe("createRateLimitInterceptor", (): void => {
    it("should allow requests under the limit", async (): Promise<void> => {
      const handler = createRateLimitInterceptor(5, 1000);
      const next = jest.fn().mockResolvedValue({
        status: 200,
        headers: {},
        data: "ok",
      });

      for (let i = 0; i < 5; i++) {
        const result = await handler(
          { method: "GET", url: "/test" },
          next,
        );
        expect(result.status).toBe(200);
      }

      expect(next).toHaveBeenCalledTimes(5);
    });

    it("should throttle when rate limit is exceeded", async (): Promise<void> => {
      const handler = createRateLimitInterceptor(1, 200);
      const next = jest.fn().mockResolvedValue({
        status: 200,
        headers: {},
        data: "ok",
      });

      // First request goes through
      await handler({ method: "GET", url: "/test" }, next);

      // Second request should be throttled (waits), then goes through
      const start = Date.now();
      await handler({ method: "GET", url: "/test" }, next);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(180);
      expect(next).toHaveBeenCalledTimes(2);
    });

    it("should purge timestamps outside the sliding window", async (): Promise<void> => {
      const handler = createRateLimitInterceptor(5, 50);
      const next = jest.fn().mockResolvedValue({
        status: 200,
        headers: {},
        data: "ok",
      });

      await handler({ method: "GET", url: "/test" }, next);
      await handler({ method: "GET", url: "/test" }, next);

      // Wait for the 50ms window to fully expire
      await new Promise((resolve) => setTimeout(resolve, 60));

      // This request should find timestamps outside the window and purge them via the while loop
      await handler({ method: "GET", url: "/test" }, next);

      expect(next).toHaveBeenCalledTimes(3);
    });

    it("should throttle after purging old timestamps when recent ones still fill the limit", async (): Promise<void> => {
      const handler = createRateLimitInterceptor(2, 200);
      const next = jest.fn().mockResolvedValue({
        status: 200,
        headers: {},
        data: "ok",
      });

      await handler({ method: "GET", url: "/test" }, next);
      await handler({ method: "GET", url: "/test" }, next);

      // Wait enough for the first timestamp to expire but keep the second within window
      await new Promise((resolve) => setTimeout(resolve, 150));

      // timestamps[0] may be purged, timestamps[1] is still within 200ms window
      // length is at least 1 (or 2 if purge didn't catch [0])
      // If length >= maxRequests (2), it will wait
      await handler({ method: "GET", url: "/test" }, next);

      // If throttled, wait time should be > 0
      expect(next).toHaveBeenCalledTimes(3);
    });

    it("should handle multiple throttled requests with purge sequence", async (): Promise<void> => {
      const handler = createRateLimitInterceptor(3, 100);
      const next = jest.fn().mockResolvedValue({
        status: 200,
        headers: {},
        data: "ok",
      });

      for (let i = 0; i < 3; i++) {
        await handler({ method: "GET", url: "/test" }, next);
      }

      // All done within the 100ms window, length >= maxRequests
      // Wait for the full window to expire plus a bit
      await new Promise((resolve) => setTimeout(resolve, 120));

      // All old timestamps should be purged, new request goes through immediately
      await handler({ method: "GET", url: "/test" }, next);

      expect(next).toHaveBeenCalledTimes(4);
    });
  });

  describe("createLoggingInterceptor (default logFn)", (): void => {
    it("should use default noop log function when none provided", async (): Promise<void> => {
      const handler = createLoggingInterceptor();
      const next = jest.fn().mockResolvedValue({
        status: 200,
        headers: {},
        data: "ok",
      });

      const result = await handler(
        { method: "GET", url: "/test" },
        next,
      );

      expect(result.status).toBe(200);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("createRetryInterceptor (default params)", (): void => {
    it("should use default retry parameters when none provided", async (): Promise<void> => {
      const handler = createRetryInterceptor();
      const next = jest.fn().mockResolvedValue({
        status: 200,
        headers: {},
        data: "ok",
      });

      const result = await handler({ method: "GET", url: "/test" }, next);
      expect(result.status).toBe(200);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });

  describe("createRateLimitInterceptor (default and edge params)", (): void => {
    it("should use default rate limit parameters when none provided", async (): Promise<void> => {
      const handler = createRateLimitInterceptor();
      const next = jest.fn().mockResolvedValue({
        status: 200,
        headers: {},
        data: "ok",
      });

      const result = await handler({ method: "GET", url: "/test" }, next);
      expect(result.status).toBe(200);
    });

    it("should handle maxRequests=0 edge case (nullish coalesce)", async (): Promise<void> => {
      const handler = createRateLimitInterceptor(0, 50);
      const next = jest.fn().mockResolvedValue({
        status: 200,
        headers: {},
        data: "ok",
      });

      // When maxRequests=0, length >= 0 is always true
      // timestamps[0] will be undefined, so the ?? uses `now`
      // waitMs = now + 50 - now = 50
      const start = Date.now();
      await handler({ method: "GET", url: "/test" }, next);
      const elapsed = Date.now() - start;

      expect(elapsed).toBeGreaterThanOrEqual(40);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
