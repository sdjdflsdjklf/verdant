import { injectable } from "tsyringe";
import type {
  HttpClientPort,
  HttpRequestConfig,
  HttpResponse,
} from "../../domain/ports/http-client.port";
import type { HttpInterceptorFn } from "../../domain/ports/http-interceptor.port";

const DEFAULT_TIMEOUT_MS = 120_000;

/**
 * Type for the inner "next" handler — a simpler alias used in the chain.
 */
type NextHandler = (request: HttpRequestConfig) => Promise<HttpResponse>;

/**
 * HTTP client using the global `fetch` API (available in Electron / Obsidian).
 * Supports an interceptor chain for cross-cutting concerns.
 */
@injectable()
export class HttpClient implements HttpClientPort {
  private interceptors: HttpInterceptorFn[] = [];

  /** Register an interceptor. Later interceptors wrap earlier ones. */
  public addInterceptor(fn: HttpInterceptorFn): void {
    this.interceptors.push(fn);
  }

  public async request<T>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
    const chain = this.buildChain();
    const response = await chain(config);
    return response as HttpResponse<T>;
  }

  public async get<T>(
    url: string,
    config?: Partial<HttpRequestConfig>,
  ): Promise<HttpResponse<T>> {
    return await this.request<T>({ method: "GET", url, ...config });
  }

  public async post<T>(
    url: string,
    data?: unknown,
    config?: Partial<HttpRequestConfig>,
  ): Promise<HttpResponse<T>> {
    return await this.request<T>({
      method: "POST",
      url,
      body: data,
      ...config,
    });
  }

  public async patch<T>(
    url: string,
    data?: unknown,
    config?: Partial<HttpRequestConfig>,
  ): Promise<HttpResponse<T>> {
    return await this.request<T>({
      method: "PATCH",
      url,
      body: data,
      ...config,
    });
  }

  public async delete<T>(
    url: string,
    config?: Partial<HttpRequestConfig>,
  ): Promise<HttpResponse<T>> {
    return await this.request<T>({ method: "DELETE", url, ...config });
  }

  // ── Private ────────────────────────────────────────────────────────

  /**
   * Build a composed interceptor chain ending with the actual fetch call.
   * Interceptors are composed outside-in: last registered = outermost.
   */
  private buildChain(): NextHandler {
    // Innermost call: the real fetch
    const baseHandler: NextHandler = async (
      request: HttpRequestConfig,
    ): Promise<HttpResponse> => {
      return await this.executeFetch(request);
    };

    // Compose interceptors outside-in
    return this.interceptors
      .slice()
      .reverse()
      .reduce((wrapped: NextHandler, interceptor: HttpInterceptorFn): NextHandler => {
        return (request: HttpRequestConfig): Promise<HttpResponse> =>
          interceptor(request, wrapped);
      }, baseHandler);
  }

  private async executeFetch(config: HttpRequestConfig): Promise<HttpResponse> {
    const controller = new AbortController();
    const timeoutMs = config.timeout ?? DEFAULT_TIMEOUT_MS;
    const timeoutId = setTimeout((): void => controller.abort(), timeoutMs);

    // Merge custom abort signal with timeout
    const [signal, cleanupSignals] = config.signal
      ? combineSignals(config.signal, controller.signal)
      : [controller.signal, (): void => {}] as const;

    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
        ...config.headers,
      };

      const body =
        config.body !== undefined ? JSON.stringify(config.body) : undefined;

      if (body !== undefined) {
        headers["Content-Type"] = "application/json";
      }

      const response = await fetch(config.url, {
        method: config.method,
        headers,
        body,
        signal,
      });

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value: string, key: string): void => {
        responseHeaders[key] = value;
      });

      let data: unknown;
      const contentType = response.headers.get("content-type") ?? "";
      if (contentType.includes("application/json")) {
        data = (await response.json()) as unknown;
      } else {
        data = await response.text();
      }

      return {
        status: response.status,
        headers: responseHeaders,
        data,
      };
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        if (controller.signal.aborted) {
          const timeoutErr: Error & { cause?: unknown } = new Error(
            `Request to ${config.url} timed out after ${timeoutMs}ms. ` +
            "Check your network connection or try again.",
          );
          timeoutErr.cause = error;
          throw timeoutErr;
        }
        throw error;
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
      cleanupSignals();
    }
  }
}

/**
 * Combine two AbortSignals into one.
 * Returns the combined signal and a cleanup function to remove listeners.
 */
function combineSignals(
  s1: AbortSignal,
  s2: AbortSignal,
): [AbortSignal, () => void] {
  const controller = new AbortController();

  const onAbort1 = (): void => controller.abort();
  const onAbort2 = (): void => controller.abort();

  s1.addEventListener("abort", onAbort1, { once: true });
  s2.addEventListener("abort", onAbort2, { once: true });

  const cleanup = (): void => {
    s1.removeEventListener("abort", onAbort1);
    s2.removeEventListener("abort", onAbort2);
  };

  return [controller.signal, cleanup];
}
