export interface KeyValueStorePort {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): void;
  delete(key: string): boolean;
  has(key: string): boolean;
  clear(): void;
  getAll<T>(): Record<string, T>;
}