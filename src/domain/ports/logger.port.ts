/**
 * Log levels in increasing severity order.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * Port interface for the logging service.
 *
 * Domain services depend on this abstraction rather than
 * `console` directly, enabling testability and swappable transports.
 */
export interface LoggerPort {
  /** Set the minimum log level. Messages below this level are suppressed. */
  setLevel(level: LogLevel): void;

  /** Debug / trace — verbose diagnostic information. */
  debug(message: string, ...meta: unknown[]): void;

  /** Info — general operational messages. */
  info(message: string, ...meta: unknown[]): void;

  /** Warn — something unexpected but non-fatal. */
  warn(message: string, ...meta: unknown[]): void;

  /** Error — a failure that needs attention. */
  error(message: string, ...meta: unknown[]): void;
}
