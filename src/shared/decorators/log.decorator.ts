/**
 * Global toggle for the @Log() decorator.
 * Set `LogDecorator.enabled = false` to suppress all logging in production.
 */
export const LogDecorator = {
  enabled: true,
};

/**
 * Method decorator that logs method entry and exit (or error).
 * Uses `console.debug` for trace-level logging during development.
 *
 * @example
 * ```ts
 * class UserService {
 *   @Log()
 *   public async createUser(name: string): Promise<User> {
 *     // ...
 *   }
 * }
 * ```
 */
export function Log(): MethodDecorator {
  return (
    _target: object,
    propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const originalMethod: unknown = descriptor.value;

    if (typeof originalMethod !== "function") {
      return descriptor;
    }

    const methodName = String(propertyKey);

    descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
      if (!LogDecorator.enabled) {
        const result: unknown = originalMethod.apply(this, args);
        return result;
      }

      const sanitizedArgs = args.map(sanitizeArg);
      console.debug(`[Log] ▶ ${methodName}(`, ...sanitizedArgs, `)`);

      try {
        const result: unknown = originalMethod.apply(this, args);

        if (isPromise(result)) {
          return result
            .then((value: unknown): unknown => {
              console.debug(`[Log] ✓ ${methodName} →`, value);
              return value;
            })
            .catch((error: unknown): never => {
              console.debug(`[Log] ✗ ${methodName} →`, error);
              throw error;
            });
        }

        console.debug(`[Log] ✓ ${methodName} →`, result);
        return result;
      } catch (error: unknown) {
        console.debug(`[Log] ✗ ${methodName} →`, error);
        throw error;
      }
    };

    Object.defineProperty(descriptor.value, "name", { value: methodName });
    Object.defineProperty(descriptor.value, "length", { value: (originalMethod as (...a: unknown[]) => unknown).length });

    return descriptor;
  };
}

function isPromise(value: unknown): value is Promise<unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    typeof (value as Promise<unknown>).then === "function"
  );
}

function sanitizeArg(arg: unknown): unknown {
  if (arg === null || arg === undefined) {
    return arg;
  }
  if (typeof arg === "object") {
    if (Array.isArray(arg)) {
      return `[Array(${arg.length})]`;
    }
    const keys = Object.keys(arg);
    if (keys.length > 5) {
      return `{Object(${keys.length} keys)}`;
    }
  }
  return arg;
}
