import "reflect-metadata";
import type { LoggerPort } from "../domain/ports";
import { ErrorBoundary } from "./error-boundary";

describe("ErrorBoundary", (): void => {
  let mockLogger: jest.Mocked<LoggerPort>;

  beforeEach((): void => {
    mockLogger = {
      debug: jest.fn(),
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      setLevel: jest.fn(),
    } as jest.Mocked<LoggerPort>;
  });

  describe("wrap", (): void => {
    it("should return result on successful operation", async (): Promise<void> => {
      const result: string = await ErrorBoundary.wrap(
        async () => "success",
        "test",
        mockLogger,
      );

      expect(result).toBe("success");
    });

    it("should rethrow Error instance and log error message", async (): Promise<void> => {
      const testError: Error = new Error("test error");

      await expect(
        ErrorBoundary.wrap(
          async () => {
            throw testError;
          },
          "test",
          mockLogger,
        ),
      ).rejects.toThrow("test error");

      expect(mockLogger.error).toHaveBeenCalledWith("[test] test error");
    });

    it("should rethrow non-Error throw and log stringified version", async (): Promise<void> => {
      const nonError: string = "string error";

      await expect(
        ErrorBoundary.wrap(
          async () => {
            throw nonError;
          },
          "test",
          mockLogger,
        ),
      ).rejects.toBe("string error");

      expect(mockLogger.error).toHaveBeenCalledWith("[test] string error");
    });
  });

  describe("safeExecute", (): void => {
    it("should return fallback when operation throws Error", async (): Promise<void> => {
      const result: string = await ErrorBoundary.safeExecute(
        async () => {
          throw new Error("fail");
        },
        "fallback-value",
        mockLogger,
        "test",
      );

      expect(result).toBe("fallback-value");
      expect(mockLogger.error).toHaveBeenCalledWith("[test] fail");
    });

    it("should return fallback when operation throws non-Error", async (): Promise<void> => {
      const result: number = await ErrorBoundary.safeExecute(
        async () => {
          throw 42;
        },
        -1,
        mockLogger,
        "test",
      );

      expect(result).toBe(-1);
      expect(mockLogger.error).toHaveBeenCalledWith("[test] 42");
    });
  });
});
