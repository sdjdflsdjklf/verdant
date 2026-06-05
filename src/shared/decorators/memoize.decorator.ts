interface MemoizeEntry {
  result: unknown;
  timestamp: number;
}

const DEFAULT_TTL_MS = 5 * 60 * 1000;
const DEFAULT_MAX_ENTRIES = 100;

export interface MemoizeOptions {
  ttlMs?: number;
  maxEntries?: number;
}

export function Memoize(optionsOrTtlMs: number | MemoizeOptions = DEFAULT_TTL_MS): MethodDecorator {
  return (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ): PropertyDescriptor => {
    const originalMethod: unknown = descriptor.value;

    if (typeof originalMethod !== "function") {
      return descriptor;
    }

    const options: MemoizeOptions = typeof optionsOrTtlMs === "number"
      ? { ttlMs: optionsOrTtlMs }
      : optionsOrTtlMs;
    const ttlMs: number = options.ttlMs ?? DEFAULT_TTL_MS;
    const maxEntries: number = options.maxEntries ?? DEFAULT_MAX_ENTRIES;

    const instanceCache = new WeakMap<object, Map<string, MemoizeEntry>>();
    const staticCache = new Map<string, MemoizeEntry>();

    descriptor.value = function (this: unknown, ...args: unknown[]): unknown {
      const cache: Map<string, MemoizeEntry> =
        typeof this === "object" && this !== null
          ? (instanceCache.get(this) ?? new Map<string, MemoizeEntry>())
          : staticCache;

      let key: string;
      try {
        key = JSON.stringify(args);
      } catch {
        key = String(args);
      }

      const cached: MemoizeEntry | undefined = cache.get(key);
      if (cached !== undefined && Date.now() - cached.timestamp < ttlMs) {
        cache.delete(key);
        cache.set(key, cached);
        return cached.result;
      }

      if (cached !== undefined) {
        cache.delete(key);
      }

      const result: unknown = originalMethod.apply(this, args);

      cache.set(key, { result, timestamp: Date.now() });

      while (cache.size > maxEntries) {
        // IteratorResult.value is typed as `any`; narrow with explicit cast
        const oldestKey: string | undefined = cache.keys().next().value as string | undefined;
        if (oldestKey !== undefined) {
          cache.delete(oldestKey);
        } else {
          break;
        }
      }

      if (typeof this === "object" && this !== null) {
        instanceCache.set(this, cache);
      }

      return result;
    };

    return descriptor;
  };
}