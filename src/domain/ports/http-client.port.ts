/**
 * HTTP method enum.
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Configuration for an HTTP request.
 */
export interface HttpRequestConfig {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: unknown;
  /** Request timeout in milliseconds (default 30 000). */
  timeout?: number;
  /** Abort signal for cancellation. */
  signal?: AbortSignal;
}

/**
 * Standard HTTP response.
 */
export interface HttpResponse<T = unknown> {
  status: number;
  headers: Record<string, string>;
  data: T;
}

/**
 * Port interface for the HTTP client.
 *
 * Used by the GitHub domain services to call the GitHub REST API.
 */
export interface HttpClientPort {
  /** Perform an HTTP request. */
  request<T>(config: HttpRequestConfig): Promise<HttpResponse<T>>;

  /** Convenience: HTTP GET. */
  get<T>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;

  /** Convenience: HTTP POST. */
  post<T>(url: string, data?: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;

  /** Convenience: HTTP PATCH. */
  patch<T>(url: string, data?: unknown, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;

  /** Convenience: HTTP DELETE. */
  delete<T>(url: string, config?: Partial<HttpRequestConfig>): Promise<HttpResponse<T>>;
}
