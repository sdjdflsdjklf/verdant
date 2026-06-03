/**
 * This file is a logging service — calling console is its intended purpose.
 * eslint-disable no-console is legitimate here.
 */

/* eslint-disable no-console */

import { injectable } from "tsyringe";
import type { LogLevel, LoggerPort } from "../../domain/ports/logger.port";

/** Numeric rank for log-level comparison (higher = more severe). */
const LEVEL_RANK: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Console-based logger implementing {@link LoggerPort}.
 * In production, set the level to `"info"` to suppress debug output.
 */
@injectable()
export class LoggerService implements LoggerPort {
  private minLevel: LogLevel = "debug";

  public setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  public debug(message: string, ...meta: unknown[]): void {
    this.log("debug", message, meta);
  }

  public info(message: string, ...meta: unknown[]): void {
    this.log("info", message, meta);
  }

  public warn(message: string, ...meta: unknown[]): void {
    this.log("warn", message, meta);
  }

  public error(message: string, ...meta: unknown[]): void {
    this.log("error", message, meta);
  }

  private log(level: LogLevel, message: string, meta: unknown[]): void {
    if (LEVEL_RANK[level] < LEVEL_RANK[this.minLevel]) {
      return;
    }

    const prefix = `[OG][${level.toUpperCase()}]`;
    const fullMessage = `${prefix} ${message}`;

    switch (level) {
      case "debug":
        console.debug(fullMessage, ...meta);
        break;
      case "info":
        console.info(fullMessage, ...meta);
        break;
      case "warn":
        console.warn(fullMessage, ...meta);
        break;
      case "error":
        console.error(fullMessage, ...meta);
        break;
    }
  }
}
