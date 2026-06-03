import type { HttpClientPort, LoggerPort } from "../ports";
import type { HttpResponse } from "../ports/http-client.port";
import type { AuthResult } from "../../types/github.types";
import { GITHUB_API_BASE } from "../../constants/github.constants";
import { GithubAuthService } from "./github-auth.service";

function createMockHttpClient(): jest.Mocked<HttpClientPort> {
  return {
    request: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };
}

function createMockLogger(): jest.Mocked<LoggerPort> {
  return {
    setLevel: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}

describe("GithubAuthService", (): void => {
  let mockHttpClient: jest.Mocked<HttpClientPort>;
  let mockLogger: jest.Mocked<LoggerPort>;
  let service: GithubAuthService;

  beforeEach((): void => {
    jest.restoreAllMocks();
    mockHttpClient = createMockHttpClient();
    mockLogger = createMockLogger();
    service = new GithubAuthService(mockHttpClient, mockLogger);
  });

  describe("validateToken", (): void => {
    it("should return valid result with username on 200", async (): Promise<void> => {
      mockHttpClient.get.mockResolvedValue({
        status: 200,
        headers: {},
        data: { login: "testuser" },
      } as HttpResponse<{ login: string }>);

      const result: AuthResult = await service.validateToken("valid-token");

      expect(result.valid).toBe(true);
      expect(result.username).toBe("testuser");
      expect(result.error).toBeUndefined();
      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${GITHUB_API_BASE}/user`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: "Bearer valid-token",
          }),
        }),
      );
    });

    it("should return invalid result on 401", async (): Promise<void> => {
      mockHttpClient.get.mockResolvedValue({
        status: 401,
        headers: {},
        data: { message: "Bad credentials" },
      } as HttpResponse<{ message: string }>);

      const result: AuthResult = await service.validateToken("bad-token");

      expect(result.valid).toBe(false);
      expect(result.error).toBe(
        "Token is invalid or expired. Please generate a new Personal Access Token.",
      );
    });

    it("should return invalid result on 403", async (): Promise<void> => {
      mockHttpClient.get.mockResolvedValue({
        status: 403,
        headers: {},
        data: { message: "Forbidden" },
      } as HttpResponse<{ message: string }>);

      const result: AuthResult = await service.validateToken("forbidden-token");

      expect(result.valid).toBe(false);
      expect(result.error).toBeDefined();
    });

    it("should handle unexpected status codes", async (): Promise<void> => {
      mockHttpClient.get.mockResolvedValue({
        status: 500,
        headers: {},
        data: {},
      } as HttpResponse<Record<string, never>>);

      const result: AuthResult = await service.validateToken("token");

      expect(result.valid).toBe(false);
      expect(result.error).toContain("500");
    });

    it("should handle network errors gracefully", async (): Promise<void> => {
      mockHttpClient.get.mockRejectedValue(new Error("Network failure"));

      const result: AuthResult = await service.validateToken("token");

      expect(result.valid).toBe(false);
      expect(result.error).toContain("Network error");
    });

    it("should send correct authorization headers", async (): Promise<void> => {
      mockHttpClient.get.mockResolvedValue({
        status: 200,
        headers: {},
        data: { login: "user" },
      } as HttpResponse<{ login: string }>);

      await service.validateToken("my-secret-token");

      expect(mockHttpClient.get).toHaveBeenCalledWith(
        `${GITHUB_API_BASE}/user`,
        expect.objectContaining({
          headers: {
            Authorization: "Bearer my-secret-token",
            Accept: "application/vnd.github.v3+json",
          },
        }),
      );
    });
  });
});
