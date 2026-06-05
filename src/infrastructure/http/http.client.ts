import { injectable } from "tsyringe";
import { requestUrl } from "obsidian";
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
 * HTTP client using Obsidian's `requestUrl` for network requests.
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
   * Build a composed interceptor chain ending with the actual request call.
   * Interceptors are composed outside-in: last registered = outermost.
   */
  private buildChain(): NextHandler {
    // Innermost call: the real HTTP request via requestUrl
    const baseHandler: NextHandler = async (
      request: HttpRequestConfig,
    ): Promise<HttpResponse> => {
      return await this.executeRequest(request);
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

  private async executeRequest(config: HttpRequestConfig): Promise<HttpResponse> {
    const method: string = config.method ?? "GET";
    const timeoutMs = config.timeout ?? DEFAULT_TIMEOUT_MS;

    const headers: Record<string, string> = {
      Accept: "application/json",
      ...config.headers,
    };

    let body: string | ArrayBuffer | undefined;
    if (config.body !== undefined) {
      body = JSON.stringify(config.body);
      headers["Content-Type"] = "application/json";
    }

    const requestPromise: Promise<HttpResponse> = (async (): Promise<HttpResponse> => {
      try {
        const response = await requestUrl({
          url: config.url,
          method,
          headers,
          body,
          contentType: headers["Content-Type"] ?? "application/json",
        });

        const responseHeaders: Record<string, string> = {};
        if (response.headers) {
          for (const [key, value] of Object.entries(response.headers)) {
            responseHeaders[key] = String(value);
          }
        }

        let data: unknown = response.json;
        if (data === undefined || data === null) {
          try {
            data = JSON.parse(response.text);
          } catch {
            data = response.text;
          }
        }

        return {
          status: response.status,
          headers: responseHeaders,
          data,
        };
      } catch (error: unknown) {
        const obsError = error as {
          status?: number;
          message?: string;
          json?: unknown;
          headers?: Record<string, string>;
        };
        let errorData: unknown;
        if (obsError.json !== undefined && obsError.json !== null) {
          errorData = obsError.json;
        } else if (obsError.message !== undefined) {
          try {
            errorData = JSON.parse(obsError.message);
          } catch {
            errorData = { error: obsError.message };
          }
        } else {
          errorData = { error: String(error) };
        }
        return {
          status: obsError.status ?? 0,
          headers: obsError.headers ?? {},
          data: errorData,
        };
      }
    })();

    const timeoutPromise: Promise<HttpResponse> = new Promise<HttpResponse>((resolve): void => {
      window.setTimeout((): void => {
        resolve({
          status: 0,
          headers: {},
          data: { error: `Request to ${config.url} timed out after ${timeoutMs}ms. Check your network connection or try again.` },
        });
      }, timeoutMs);
    });

    return await Promise.race([requestPromise, timeoutPromise]);
  }
}
