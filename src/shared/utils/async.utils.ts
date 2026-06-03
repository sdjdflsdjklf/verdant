export interface RetryOptions {
  /** Maximum number of retry attempts */
  retries: number;
  /** Delay in ms before first retry (doubles each attempt) */
  baseDelayMs?: number;
  /** Maximum delay in ms between retries */
  maxDelayMs?: number;
  /** Optional predicate to determine if error is retryable */
  shouldRetry?: (error: unknown) => boolean;
}

/**
 * Retry an async function with exponential backoff.
 * Throws the last error if all retries are exhausted.
 */
export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions,
): Promise<T> {
  const {
    retries: maxRetries,
    baseDelayMs = 1000,
    maxDelayMs = 30000,
    shouldRetry = (): boolean => true,
  } = options;

  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      if (attempt < maxRetries && shouldRetry(error)) {
        const delay = Math.min(baseDelayMs * 2 ** attempt, maxDelayMs);
        await sleep(delay);
      } else {
        throw error;
      }
    }
  }
}

/**
 * Add a timeout to an existing promise. If the promise does not settle
 * within the given milliseconds, the returned promise rejects with a TimeoutError.
 */
export async function timeout<T>(
  promise: Promise<T>,
  ms: number,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const timeoutPromise = new Promise<never>(
    (_, reject): void => {
      timer = setTimeout((): void => {
        reject(new TimeoutError(ms));
      }, ms);
    },
  );

  try {
    const result = await Promise.race([promise, timeoutPromise]);
    return result;
  } finally {
    if (timer !== undefined) {
      clearTimeout(timer);
    }
  }
}

export class TimeoutError extends Error {
  public readonly ms: number;

  public constructor(ms: number) {
    super(`Operation timed out after ${ms}ms`);
    this.name = "TimeoutError";
    this.ms = ms;
  }
}

/**
 * Promise-based sleep.
 */
export async function sleep(ms: number): Promise<void> {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * A simple async queue that ensures sequential execution of tasks.
 */
export class AsyncQueue {
  private previous: Promise<unknown> = Promise.resolve();

  /**
   * Enqueue an async function. It will run after all previously enqueued
   * tasks have completed.
   */
  public async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    const result = this.previous.then(async (): Promise<T> => await fn());
    // Errors in previous tasks must not break the chain for subsequent tasks.
    // Each caller receives and handles its own rejection via the returned promise.
    this.previous = result.catch((): void => {});
    return await result;
  }
}

/**
 * Create a "cancellable" promise wrapper with an abort signal.
 * The returned promise rejects with an `AbortError` if the signal is aborted.
 */
export async function withAbort<T>(
  promise: Promise<T>,
  signal: AbortSignal,
): Promise<T> {
  if (signal.aborted) {
    throw new AbortError();
  }

  return await new Promise<T>((resolve, reject): void => {
    const onAbort = (): void => {
      reject(new AbortError());
    };

    signal.addEventListener("abort", onAbort, { once: true });

    promise.then(
      (value: T): void => {
        signal.removeEventListener("abort", onAbort);
        resolve(value);
      },
      (error: unknown): void => {
        signal.removeEventListener("abort", onAbort);
        reject(error);
      },
    );
  });
}

export class AbortError extends Error {
  public constructor() {
    super("Operation was aborted");
    this.name = "AbortError";
  }
}
