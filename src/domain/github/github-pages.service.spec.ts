import type { HttpClientPort, LoggerPort } from "../ports";
import type { HttpResponse } from "../ports/http-client.port";
import type { PagesInfo } from "../../types/github.types";
import { GITHUB_API_BASE } from "../../constants/github.constants";
import { GithubPagesService } from "./github-pages.service";

function createHttpMock(): jest.Mocked<HttpClientPort> {
  return {
    request: jest.fn(),
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
  };
}

function createLoggerMock(): jest.Mocked<LoggerPort> {
  return {
    setLevel: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}

const TOKEN = "ghp_test";
const OWNER = "testuser";
const REPO = "my-garden";

describe("GithubPagesService", (): void => {
  let http: jest.Mocked<HttpClientPort>;
  let logger: jest.Mocked<LoggerPort>;
  let service: GithubPagesService;

  beforeEach((): void => {
    jest.restoreAllMocks();
    http = createHttpMock();
    logger = createLoggerMock();
    service = new GithubPagesService(http, logger);
  });

  describe("enablePages", (): void => {
    it("should enable pages with custom branch", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 404,
        headers: {},
        data: { message: "Not Found" },
      } as HttpResponse<Record<string, unknown>>);

      http.post.mockResolvedValue({
        status: 201,
        headers: {},
        data: {},
      } as HttpResponse<Record<string, unknown>>);

      await service.enablePages(TOKEN, OWNER, REPO, "gh-pages");

      expect(http.get).toHaveBeenCalledWith(
        `${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/pages`,
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${TOKEN}`,
          }),
        }),
      );
      expect(http.post).toHaveBeenCalledWith(
        `${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/pages`,
        {
          source: { branch: "gh-pages", path: "/" },
        },
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: `Bearer ${TOKEN}`,
          }),
        }),
      );
    });

    it("should default to gh-pages branch", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 404,
        headers: {},
        data: { message: "Not Found" },
      } as HttpResponse<Record<string, unknown>>);

      http.post.mockResolvedValue({
        status: 201,
        headers: {},
        data: {},
      } as HttpResponse<Record<string, unknown>>);

      await service.enablePages(TOKEN, OWNER, REPO);

      expect(http.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          source: expect.objectContaining({ branch: "gh-pages" }),
        }),
        expect.any(Object),
      );
    });

    it("should skip POST when Pages already enabled (GET returns 200)", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 200,
        headers: {},
        data: { status: "built", html_url: "https://testuser.github.io/my-garden/" },
      } as HttpResponse<Record<string, unknown>>);

      await expect(
        service.enablePages(TOKEN, OWNER, REPO),
      ).resolves.toBeUndefined();

      expect(http.get).toHaveBeenCalledTimes(1);
      expect(http.post).not.toHaveBeenCalled();
    });

    it("should handle 204 (already enabled no content)", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 404,
        headers: {},
        data: { message: "Not Found" },
      } as HttpResponse<Record<string, unknown>>);

      http.post.mockResolvedValue({
        status: 204,
        headers: {},
        data: {},
      } as HttpResponse<Record<string, unknown>>);

      await expect(
        service.enablePages(TOKEN, OWNER, REPO),
      ).resolves.toBeUndefined();
    });

    it("should handle 409 (already enabled conflict) as fallback", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 404,
        headers: {},
        data: { message: "Not Found" },
      } as HttpResponse<Record<string, unknown>>);

      http.post.mockResolvedValue({
        status: 409,
        headers: {},
        data: { message: "Pages already enabled" },
      } as HttpResponse<Record<string, unknown>>);

      await expect(
        service.enablePages(TOKEN, OWNER, REPO),
      ).resolves.toBeUndefined();
    });

    it("should throw on unexpected status", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 404,
        headers: {},
        data: { message: "Not Found" },
      } as HttpResponse<Record<string, unknown>>);

      http.post.mockResolvedValue({
        status: 422,
        headers: {},
        data: { message: "Unprocessable" },
      } as HttpResponse<Record<string, unknown>>);

      await expect(
        service.enablePages(TOKEN, OWNER, REPO),
      ).rejects.toThrow();
    });

    it("should propagate network errors", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 404,
        headers: {},
        data: { message: "Not Found" },
      } as HttpResponse<Record<string, unknown>>);

      http.post.mockRejectedValue(new Error("Network failure"));

      await expect(
        service.enablePages(TOKEN, OWNER, REPO),
      ).rejects.toThrow("Network failure");
    });
  });

  describe("getPagesStatus", (): void => {
    it("should return enabled status with url", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 200,
        headers: {},
        data: {
          status: "built",
          html_url: "https://testuser.github.io/my-garden/",
        },
      } as HttpResponse<Record<string, unknown>>);

      const result: PagesInfo = await service.getPagesStatus(
        TOKEN,
        OWNER,
        REPO,
      );

      expect(result.enabled).toBe(true);
      expect(result.url).toBe("https://testuser.github.io/my-garden/");
      expect(result.status).toBe("built");
    });

    it("should return building status", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 200,
        headers: {},
        data: {
          status: "building",
          html_url: "https://testuser.github.io/my-garden/",
        },
      } as HttpResponse<Record<string, unknown>>);

      const result: PagesInfo = await service.getPagesStatus(
        TOKEN,
        OWNER,
        REPO,
      );

      expect(result.enabled).toBe(true);
      expect(result.status).toBe("building");
    });

    it("should return not enabled on 404", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 404,
        headers: {},
        data: { message: "Not Found" },
      } as HttpResponse<Record<string, unknown>>);

      const result: PagesInfo = await service.getPagesStatus(
        TOKEN,
        OWNER,
        REPO,
      );

      expect(result.enabled).toBe(false);
      expect(result.url).toBe("");
      expect(result.status).toBeNull();
    });

    it("should handle unexpected status codes", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 500,
        headers: {},
        data: {},
      } as HttpResponse<Record<string, unknown>>);

      const result: PagesInfo = await service.getPagesStatus(
        TOKEN,
        OWNER,
        REPO,
      );

      expect(result.enabled).toBe(false);
    });

    it("should handle network errors", async (): Promise<void> => {
      http.get.mockRejectedValue(new Error("Network failure"));

      const result: PagesInfo = await service.getPagesStatus(
        TOKEN,
        OWNER,
        REPO,
      );

      expect(result.enabled).toBe(false);
    });

    it("should send correct auth headers", async (): Promise<void> => {
      http.get.mockResolvedValue({
        status: 200,
        headers: {},
        data: {
          status: "built",
          html_url: "https://example.com",
        },
      } as HttpResponse<Record<string, unknown>>);

      await service.getPagesStatus(TOKEN, OWNER, REPO);

      expect(http.get).toHaveBeenCalledWith(
        `${GITHUB_API_BASE}/repos/${OWNER}/${REPO}/pages`,
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }),
      );
    });
  });
});
