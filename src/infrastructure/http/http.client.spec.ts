import { HttpClient } from "./http.client";

describe("HttpClient", (): void => {
  let client: HttpClient;

  beforeEach((): void => {
    client = new HttpClient();
    jest.restoreAllMocks();
  });

  describe("request", (): void => {
    it("should perform a GET request and parse JSON", async (): Promise<void> => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async (): Promise<unknown> => ({ id: 1 }),
        text: async (): Promise<string> => "",
      };

      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        mockResponse as unknown as Response,
      );

      const result = await client.get<{ id: number }>(
        "https://api.example.com/data",
      );

      expect(result.status).toBe(200);
      expect(result.data).toEqual({ id: 1 });
      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/data",
        expect.objectContaining({ method: "GET" }),
      );
    });

    it("should handle non-JSON responses", async (): Promise<void> => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "text/plain" }),
        json: async (): Promise<unknown> => {
          throw new Error("not JSON");
        },
        text: async (): Promise<string> => "plain text",
      };

      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        mockResponse as unknown as Response,
      );

      const result = await client.get<string>(
        "https://api.example.com/text",
      );
      expect(result.data).toBe("plain text");
    });

    it("should POST with JSON body", async (): Promise<void> => {
      const mockResponse = {
        ok: true,
        status: 201,
        headers: new Headers({ "content-type": "application/json" }),
        json: async (): Promise<unknown> => ({ success: true }),
        text: async (): Promise<string> => "",
      };

      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        mockResponse as unknown as Response,
      );

      const result = await client.post(
        "https://api.example.com/data",
        { name: "test" },
      );

      expect(result.status).toBe(201);
      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/data",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ name: "test" }),
        }),
      );
    });

    it("should handle PATCH requests", async (): Promise<void> => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async (): Promise<unknown> => ({ updated: true }),
        text: async (): Promise<string> => "",
      };

      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        mockResponse as unknown as Response,
      );

      const result = await client.patch(
        "https://api.example.com/data/1",
        { name: "updated" },
      );

      expect(result.status).toBe(200);
      expect((result.data as { updated: boolean }).updated).toBe(true);
    });

    it("should handle DELETE requests", async (): Promise<void> => {
      const mockResponse = {
        ok: true,
        status: 204,
        headers: new Headers({}),
        json: async (): Promise<unknown> => ({}),
        text: async (): Promise<string> => "",
      };

      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        mockResponse as unknown as Response,
      );

      const result = await client.delete("https://api.example.com/data/1");
      expect(result.status).toBe(204);
    });

    it("should include custom headers", async (): Promise<void> => {
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async (): Promise<unknown> => ({}),
        text: async (): Promise<string> => "",
      };

      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        mockResponse as unknown as Response,
      );

      await client.get("https://api.example.com/data", {
        headers: { Authorization: "Bearer token123" },
      });

      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/data",
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer token123",
          }),
        }),
      );
    });
  });

  describe("interceptors", (): void => {
    it("should execute interceptors in registration order (outermost first)", async (): Promise<void> => {
      const order: string[] = [];

      // interceptor1 is added first → innermost (closest to fetch)
      client.addInterceptor(async (request, next) => {
        order.push("interceptor1 before");
        const response = await next(request);
        order.push("interceptor1 after");
        return response;
      });

      // interceptor2 is added second → outermost
      client.addInterceptor(async (request, next) => {
        order.push("interceptor2 before");
        const response = await next(request);
        order.push("interceptor2 after");
        return response;
      });

      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async (): Promise<unknown> => ({}),
        text: async (): Promise<string> => "",
      };

      const fetchSpy = jest
        .spyOn(globalThis, "fetch")
        .mockResolvedValue(mockResponse as unknown as Response);

      await client.get("https://api.example.com/data");

      // Expect: interceptor1 (inner) → interceptor2 (outer) → fetch → interceptor2 → interceptor1
      // Wait, that's wrong. Let me trace:
      // chain() calls the composed function.
      // Composition: interceptors = [i1, i2]
      // .reverse() → [i2, i1]
      // reduce: i2 wraps base → (req) => i2(req, base)
      // reduce: i1 wraps that → (req) => i1(req, (req) => i2(req, base))
      // So call chain: i1 before → (inside i1, call next = i2 wrapper) → i2 before → base → i2 after → i1 after
      expect(order).toEqual([
        "interceptor1 before",
        "interceptor2 before",
        "interceptor2 after",
        "interceptor1 after",
      ]);
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });

    it("should allow interceptors to short-circuit", async (): Promise<void> => {
      client.addInterceptor(async (_request, _next) => {
        return {
          status: 418,
          headers: {},
          data: { cached: true },
        };
      });

      const fetchSpy = jest
        .spyOn(globalThis, "fetch")
        .mockResolvedValue({} as unknown as Response);

      const result = await client.get<{ cached: boolean }>(
        "https://api.example.com/data",
      );

      expect(result.status).toBe(418);
      expect(result.data.cached).toBe(true);
      expect(fetchSpy).not.toHaveBeenCalled();
    });
  });

  describe("custom AbortSignal", (): void => {
    it("should merge custom AbortSignal with timeout signal", async (): Promise<void> => {
      const abortController = new AbortController();
      const mockResponse = {
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async (): Promise<unknown> => ({ id: 1 }),
        text: async (): Promise<string> => "",
      };

      jest.spyOn(globalThis, "fetch").mockResolvedValueOnce(
        mockResponse as unknown as Response,
      );

      const result = await client.get<{ id: number }>(
        "https://api.example.com/data",
        { signal: abortController.signal },
      );

      expect(result.status).toBe(200);
      expect(result.data).toEqual({ id: 1 });
      expect(fetch).toHaveBeenCalledWith(
        "https://api.example.com/data",
        expect.objectContaining({ signal: expect.any(AbortSignal) }),
      );
    });

    it("should propagate abort from custom signal to combined signal", async (): Promise<void> => {
      const abortController = new AbortController();

      const mockFetch = jest.fn(
        (_url: string | URL | Request, init?: RequestInit): Promise<Response> => {
          return new Promise<Response>((_resolve, reject) => {
            const handleAbort = (): void => {
              reject(new DOMException("The operation was aborted", "AbortError"));
            };

            if (init?.signal) {
              init.signal.addEventListener("abort", handleAbort, { once: true });
              if (init.signal.aborted) {
                handleAbort();
              }
            }
          });
        },
      );
      jest.spyOn(globalThis, "fetch").mockImplementation(mockFetch);

      const requestPromise = client.get<unknown>(
        "https://api.example.com/slow",
        { signal: abortController.signal },
      );

      // Let the micro-task queue drain so combineSignals listeners are set up
      await Promise.resolve();

      abortController.abort();

      await expect(requestPromise).rejects.toThrow(DOMException);
    });
  });

  describe("request timeout", (): void => {
    it("should abort the request when timeout elapses", async (): Promise<void> => {
      jest.useFakeTimers();

      const mockFetch = jest.fn(
        (_url: string | URL | Request, init?: RequestInit): Promise<Response> => {
          return new Promise<Response>((_resolve, reject) => {
            const handleAbort = (): void => {
              reject(new DOMException("The operation was aborted", "AbortError"));
            };

            if (init?.signal) {
              init.signal.addEventListener("abort", handleAbort, { once: true });
              if (init.signal.aborted) {
                handleAbort();
              }
            }
          });
        },
      );
      jest.spyOn(globalThis, "fetch").mockImplementation(mockFetch);

      const requestPromise = client.get<unknown>(
        "https://api.example.com/slow",
        { timeout: 100 },
      );

      jest.advanceTimersByTime(100);

      await expect(requestPromise).rejects.toThrow();

      jest.useRealTimers();
    });

    it("should abort via timeout when custom signal is provided", async (): Promise<void> => {
      jest.useFakeTimers();

      const abortController = new AbortController();

      const mockFetch = jest.fn(
        (_url: string | URL | Request, init?: RequestInit): Promise<Response> => {
          return new Promise<Response>((_resolve, reject) => {
            const handleAbort = (): void => {
              reject(new DOMException("The operation was aborted", "AbortError"));
            };

            if (init?.signal) {
              init.signal.addEventListener("abort", handleAbort, { once: true });
              if (init.signal.aborted) {
                handleAbort();
              }
            }
          });
        },
      );
      jest.spyOn(globalThis, "fetch").mockImplementation(mockFetch);

      const requestPromise = client.get<unknown>(
        "https://api.example.com/slow",
        { signal: abortController.signal, timeout: 100 },
      );

      jest.advanceTimersByTime(100);

      await expect(requestPromise).rejects.toThrow();

      jest.useRealTimers();
    });
  });
});
