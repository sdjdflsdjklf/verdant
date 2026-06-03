import type { LoggerPort } from "../domain/ports";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
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
