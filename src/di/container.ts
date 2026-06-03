import "reflect-metadata";
import { container } from "tsyringe";

/**
 * Re-export the tsyringe container as the application's single DI container.
 *
 * Usage:
 *   import { container } from "@/di/container";
 *   const service = container.resolve(SomeService);
 *
 * Registration happens at bootstrap time in PluginInitializer.
 */
export { container };
