import type { HttpRequestConfig, HttpResponse } from "../../domain/ports/http-client.port";
import type { HttpInterceptorFn } from "../../domain/ports/http-interceptor.port";

/**
 * Retry interceptor factory.
 * Retries the request up to `retries` times with exponential backoff.
 * By default retries all errors. Pass a `shouldRetry` predicate to limit retries.
 */
export function createRetryInterceptor(
  retries: number = 3,
  baseDelayMs: number = 1000,
  shouldRetry?: (error: unknown) => boolean,
): HttpInterceptorFn {
  const check = shouldRetry ?? ((): boolean => true);

  return async (
    request: HttpRequestConfig,
    next: (request: HttpRequestConfig) => Promise<HttpResponse>,
  ): Promise<HttpResponse> => {
    let lastError: unknown;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        return await next(request);
      } catch (error: unknown) {
        lastError = error;
        if (attempt < retries && check(error)) {
          const delay = baseDelayMs * 2 ** attempt;
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          throw error;
        }
      }
    }

    throw lastError;
  };
}

/**
 * Logging interceptor factory.
 * Logs request method, URL, and response status (or error).
 *
 * @param logFn - Optional logging function. Defaults to `console.debug`.
 */
export function createLoggingInterceptor(
  logFn?: (msg: string) => void,
): HttpInterceptorFn {
  const log = logFn ?? ((): void => {});
  return async (
    request: HttpRequestConfig,
    next: (request: HttpRequestConfig) => Promise<HttpResponse>,
  ): Promise<HttpResponse> => {
    log(`[HTTP] ▶ ${request.method} ${request.url}`);

    try {
      const response = await next(request);
      log(`[HTTP] ✓ ${request.method} ${request.url} → ${response.status}`);
      return response;
    } catch (error: unknown) {
      log(`[HTTP] ✗ ${request.method} ${request.url} → ${String(error)}`);
      throw error;
    }
  };
}

/**
 * Rate-limiting interceptor factory.
 * Ensures at most `maxRequests` happen within `windowMs` sliding window.
 */
export function createRateLimitInterceptor(
  maxRequests: number = 10,
  windowMs: number = 1000,
): HttpInterceptorFn {
  const timestamps: number[] = [];

  return async (
    request: HttpRequestConfig,
    next: (request: HttpRequestConfig) => Promise<HttpResponse>,
  ): Promise<HttpResponse> => {
    let waited = false;

    while (true) {
      const now = Date.now();

      // Purge old entries outside the window
      while (timestamps.length > 0 && timestamps[0] !== undefined && timestamps[0] < now - windowMs) {
        timestamps.shift();
      }

      if (waited || (maxRequests > 0 && timestamps.length < maxRequests)) {
        break;
      }

      // maxRequests=0 or limit reached — wait until the oldest entry expires, then recheck
      const oldest = timestamps[0];
      if (oldest === undefined) {
        // No timestamps and maxRequests <= 0: wait one window then allow
        await new Promise((resolve) => setTimeout(resolve, windowMs));
      } else {
        const waitMs = oldest + windowMs - now;
        await new Promise((resolve) => setTimeout(resolve, waitMs));
      }
      waited = true;
    }

    timestamps.push(Date.now());
    return await next(request);
  };
}
