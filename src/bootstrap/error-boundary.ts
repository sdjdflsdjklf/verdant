import type { LoggerPort } from "../domain/ports";

// ErrorBoundary is a static utility class providing error handling wrappers — no instance needed
export class ErrorBoundary {

  static async wrap<T>(
    operation: () => Promise<T>,
    context: string,
    logger: LoggerPort,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      logger.error(`[${context}] ${message}`);
      if (stack !== undefined) {
        logger.error(`[${context}] ${stack}`);
      }
      throw error;
    }
  }

  static async safeExecute<T>(
    operation: () => Promise<T>,
    fallback: T,
    logger: LoggerPort,
    context: string,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      const stack = error instanceof Error ? error.stack : undefined;
      logger.error(`[${context}] ${message}`);
      if (stack !== undefined) {
        logger.error(`[${context}] ${stack}`);
      }
      return fallback;
    }
  }
}
