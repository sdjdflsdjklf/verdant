import { HttpClient } from "./http.client";

jest.mock("obsidian", (): object => ({
  requestUrl: jest.fn(),
}), { virtual: true });

import { requestUrl } from "obsidian";

describe("HttpClient", (): void => {
  let client: HttpClient;
  let mockRequestUrl: jest.Mock;

  beforeEach((): void => {
    client = new HttpClient();
    mockRequestUrl = requestUrl as jest.Mock;
    jest.clearAllMocks();
  });

  describe("request", (): void => {
    it("should perform a GET request and parse JSON", async (): Promise<void> => {
      mockRequestUrl.mockResolvedValueOnce({
        status: 200,
        headers: { "content-type": "application/json" },
        json: { id: 1 },
        text: "",
      });

      const result = await client.get<{ id: number }>(
        "https://api.example.com/data",
      );

      expect(result.status).toBe(200);
      expect(result.data).toEqual({ id: 1 });
      expect(mockRequestUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://api.example.com/data",
          method: "GET",
        }),
      );
    });

    it("should handle non-JSON responses", async (): Promise<void> => {
      mockRequestUrl.mockResolvedValueOnce({
        status: 200,
        headers: { "content-type": "text/plain" },
        json: null,
        text: "plain text",
      });

      const result = await client.get<string>(
        "https://api.example.com/text",
      );
      expect(result.data).toBe("plain text");
    });

    it("should POST with JSON body", async (): Promise<void> => {
      mockRequestUrl.mockResolvedValueOnce({
        status: 201,
        headers: { "content-type": "application/json" },
        json: { success: true },
        text: "",
      });

      const result = await client.post(
        "https://api.example.com/data",
        { name: "test" },
      );

      expect(result.status).toBe(201);
      expect(mockRequestUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://api.example.com/data",
          method: "POST",
          body: JSON.stringify({ name: "test" }),
        }),
      );
    });

    it("should handle PATCH requests", async (): Promise<void> => {
      mockRequestUrl.mockResolvedValueOnce({
        status: 200,
        headers: { "content-type": "application/json" },
        json: { updated: true },
        text: "",
      });

      const result = await client.patch(
        "https://api.example.com/data/1",
        { name: "updated" },
      );

      expect(result.status).toBe(200);
      expect((result.data as { updated: boolean }).updated).toBe(true);
    });

    it("should handle DELETE requests", async (): Promise<void> => {
      mockRequestUrl.mockResolvedValueOnce({
        status: 204,
        headers: {},
        json: {},
        text: "",
      });

      const result = await client.delete("https://api.example.com/data/1");
      expect(result.status).toBe(204);
    });

    it("should include custom headers", async (): Promise<void> => {
      mockRequestUrl.mockResolvedValueOnce({
        status: 200,
        headers: { "content-type": "application/json" },
        json: {},
        text: "",
      });

      await client.get("https://api.example.com/data", {
        headers: { Authorization: "Bearer token123" },
      });

      expect(mockRequestUrl).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://api.example.com/data",
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

      client.addInterceptor(async (request, next) => {
        order.push("interceptor1 before");
        const response = await next(request);
        order.push("interceptor1 after");
        return response;
      });

      client.addInterceptor(async (request, next) => {
        order.push("interceptor2 before");
        const response = await next(request);
        order.push("interceptor2 after");
        return response;
      });

      mockRequestUrl.mockResolvedValue({
        status: 200,
        headers: { "content-type": "application/json" },
        json: {},
        text: "",
      });

      await client.get("https://api.example.com/data");

      expect(order).toEqual([
        "interceptor1 before",
        "interceptor2 before",
        "interceptor2 after",
        "interceptor1 after",
      ]);
      expect(mockRequestUrl).toHaveBeenCalledTimes(1);
    });

    it("should allow interceptors to short-circuit", async (): Promise<void> => {
      client.addInterceptor(async (_request, _next) => {
        return {
          status: 418,
          headers: {},
          data: { cached: true },
        };
      });

      const result = await client.get<{ cached: boolean }>(
        "https://api.example.com/data",
      );

      expect(result.status).toBe(418);
      expect(result.data.cached).toBe(true);
      expect(mockRequestUrl).not.toHaveBeenCalled();
    });
  });

  describe("request timeout", (): void => {
    it("should return timeout error when request exceeds timeout", async (): Promise<void> => {
      jest.useFakeTimers();

      // Create a promise that never resolves (simulating a hanging request)
      mockRequestUrl.mockImplementationOnce(
        (): Promise<never> => new Promise<never>((): void => {}),
      );

      const requestPromise = client.get<unknown>(
        "https://api.example.com/slow",
        { timeout: 100 },
      );

      jest.advanceTimersByTime(100);

      const result = await requestPromise;
      expect(result.status).toBe(0);
      expect(result.data).toEqual(
        expect.objectContaining({ error: expect.stringContaining("timed out") as unknown }),
      );

      jest.useRealTimers();
    });
  });
});