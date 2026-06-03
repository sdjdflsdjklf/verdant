import { retry as retryFn } from "../utils/async.utils";
import type { RetryOptions } from "../utils/async.utils";

/**
 * Method decorator that retries a function when it throws.
 * The decorated method **must** return a `Promise`.
 *
 * @example
 * ```ts
 * class ApiClient {
 *   @Retry({ retries: 3, baseDelayMs: 200 })
 *   public async fetchData(): Promise<unknown> {
 *     return await this.http.get("/data");
 *   }
 * }
 * ```
 */
export function Retry(options: RetryOptions): MethodDecorator {
  return (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const originalMethod: unknown = descriptor.value;

    if (typeof originalMethod !== "function") {
      return descriptor;
    }

    descriptor.value = function (this: unknown, ...args: unknown[]): Promise<unknown> {
      const bound = (): Promise<unknown> => {
        const result: unknown = originalMethod.apply(this, args);
        return Promise.resolve(result);
      };

      return retryFn(bound, options);
    };

    return descriptor;
  };
}
