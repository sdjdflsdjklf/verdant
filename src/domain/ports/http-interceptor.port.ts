import type { HttpRequestConfig, HttpResponse } from "./http-client.port";

/**
 * An interceptor function that can inspect, modify, or short-circuit
 * HTTP requests and responses.
 *
 * Call `next(request)` to pass the (possibly modified) request to the
 * next interceptor in the chain, or the underlying fetch implementation.
 */
export type HttpInterceptorFn = (
  request: HttpRequestConfig,
  next: (request: HttpRequestConfig) => Promise<HttpResponse>,
) => Promise<HttpResponse>;
