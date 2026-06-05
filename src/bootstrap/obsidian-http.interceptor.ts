import { requestUrl } from "obsidian";
import type { HttpInterceptorFn } from "../domain/ports/http-interceptor.port";
import type { HttpRequestConfig, HttpResponse } from "../domain/ports/http-client.port";

export const obsidianHttpInterceptor: HttpInterceptorFn = async (
  request: HttpRequestConfig,
  next: (req: HttpRequestConfig) => Promise<HttpResponse>,
): Promise<HttpResponse> => {
  const url: string = request.url;

  if (shouldUseNodeHttps(url)) {
    return await makeNodeHttpsRequest(request);
  }

  if (shouldUseObsidianRequest(url)) {
    return await makeObsidianRequest(request);
  }

  return await next(request);
};

function shouldUseNodeHttps(url: string): boolean {
  const NODE_HTTPS_DOMAINS: string[] = [
    "https://integrate.api.nvidia.com/",
  ];
  return NODE_HTTPS_DOMAINS.some((domain: string): boolean => url.startsWith(domain));
}

function shouldUseObsidianRequest(url: string): boolean {
  const CORS_DOMAINS: string[] = [
    "https://github.com/",
  ];
  return CORS_DOMAINS.some((domain: string): boolean => url.startsWith(domain));
}

function makeNodeHttpsRequest(config: HttpRequestConfig): Promise<HttpResponse> {
  const g = window as unknown as Record<string, unknown>;
  const nodeRequire: NodeJS.Require | undefined = g.require as NodeJS.Require | undefined;
  if (nodeRequire === undefined) {
    return makeObsidianRequest(config);
  }

  let https: unknown;
  try {
    https = nodeRequire("https");
  } catch {
    return makeObsidianRequest(config);
  }

interface NodeHttpResponse {
  statusCode?: number;
  headers: Record<string, string>;
  on(event: "data", listener: (chunk: unknown) => void): void;
  on(event: "end", listener: () => void): void;
  on(event: "error", listener: (err: Error) => void): void;
}

interface NodeHttpRequest {
  setTimeout(timeout: number, callback: () => void): void;
  destroy(error?: Error): void;
  on(event: "error", listener: (err: Error) => void): void;
  write(chunk: string): void;
  end(): void;
}

interface NodeHttpsModule {
  request(
    options: Record<string, unknown>,
    callback: (res: NodeHttpResponse) => void,
  ): NodeHttpRequest;
}

const httpsModule: NodeHttpsModule = https as NodeHttpsModule;

  const method: string = config.method ?? "GET";
  const headers: Record<string, string> = {
    Accept: "application/json",
    Connection: "close",
    ...config.headers,
  };
  const bodyStr: string = config.body !== undefined
    ? (typeof config.body === "string" ? config.body : JSON.stringify(config.body))
    : "";
  if (bodyStr.length > 0) {
    headers["Content-Type"] = "application/json";
    headers["Content-Length"] = String(Buffer.byteLength(bodyStr));
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(config.url);
  } catch {
    return Promise.resolve({
      status: 0,
      headers: {},
      data: { error: `Invalid URL: ${config.url}` },
    });
  }

  const DEFAULT_TIMEOUT_MS = 120_000;
  const doRequest = (): Promise<HttpResponse> => {
    return new Promise<HttpResponse>((resolve): void => {
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method,
        headers,
        servername: parsedUrl.hostname,
        // Electron's Node.js runtime ships a stale CA bundle; NVIDIA endpoints use certs
        // that fail strict verification inside Obsidian's sandbox, so we disable it here.
        rejectUnauthorized: false,
      };

      const req: NodeHttpRequest = httpsModule.request(options, (res: NodeHttpResponse): void => {
        let data = "";
        res.on("data", (chunk: unknown): void => { data += String(chunk); });
        res.on("end", (): void => {
          let parsed: unknown;
          try {
            parsed = JSON.parse(data);
          } catch {
            parsed = data;
          }
          resolve({
            status: res.statusCode ?? 0,
            headers: res.headers ?? {},
            data: parsed,
          });
        });
        res.on("error", (err: Error): void => {
          resolve({
            status: 0,
            headers: {},
            data: { error: err.message },
          });
        });
      });

      const timeoutMs: number = config.timeout ?? DEFAULT_TIMEOUT_MS;
      req.setTimeout(timeoutMs, (): void => {
        req.destroy(new Error(`Request timed out after ${timeoutMs}ms`));
      });

      req.on("error", (err: Error): void => {
        resolve({
          status: 0,
          headers: {},
          data: { error: err.message },
        });
      });

      if (bodyStr.length > 0) {
        req.write(bodyStr);
      }
      req.end();
    });
  };

  const maxRetries = 3;
  return doRequestWithRetry(doRequest, maxRetries);
}

async function doRequestWithRetry(
  doRequest: () => Promise<HttpResponse>,
  maxRetries: number,
): Promise<HttpResponse> {
  let lastResponse: HttpResponse | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 8000);
      await new Promise<void>((resolve): void => { window.setTimeout(resolve, delay); });
    }
    const response = await doRequest();
    lastResponse = response;
    if (response.status === 0 && typeof response.data === "object" && response.data !== null) {
      const errMsg: string = ((response.data as Record<string, unknown>).error as string) ?? "";
      const retryableErrors: string[] = ["ECONNRESET", "ETIMEDOUT", "ECONNREFUSED", "timed out"];
      if (retryableErrors.some((e: string): boolean => errMsg.includes(e)) && attempt < maxRetries) {
        continue;
      }
    }
    return response;
  }
  return lastResponse ?? { status: 0, headers: {}, data: { error: "Max retries exceeded" } };
}

async function makeObsidianRequest(
  config: HttpRequestConfig,
): Promise<HttpResponse> {
  const method: string = config.method ?? "GET";
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...config.headers,
  };

  let body: string | ArrayBuffer | undefined;
  if (config.body !== undefined) {
    body = JSON.stringify(config.body);
    headers["Content-Type"] = "application/json";
  }

  const timeoutMs: number = config.timeout ?? 120_000;

  const fetchPromise: Promise<HttpResponse> = (async (): Promise<HttpResponse> => {
    try {
      const response = await requestUrl({
        url: config.url,
        method,
        headers,
        body,
        contentType: headers["Content-Type"] ?? "application/json",
      });

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
        headers: response.headers,
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
        data: { error: `Request timed out after ${timeoutMs}ms` },
      });
    }, timeoutMs);
  });

  return await Promise.race([fetchPromise, timeoutPromise]);
}
