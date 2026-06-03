import { TextEncoder, TextDecoder } from "util";
import { webcrypto } from "crypto";

// Polyfill TextEncoder/TextDecoder for jsdom environment
globalThis.TextEncoder = TextEncoder;
globalThis.TextDecoder = TextDecoder as typeof globalThis.TextDecoder;

// Polyfill crypto.subtle for jsdom environment
Object.defineProperty(globalThis, "crypto", {
  value: webcrypto,
  writable: true,
  configurable: true,
});

// Polyfill fetch for jsdom environment (required by http.client.spec.ts)
if (typeof globalThis.fetch === "undefined") {
  // Minimal fetch stub — tests mock it anyway via jest.spyOn
  globalThis.fetch = (() =>
    Promise.resolve(
      new Response(null, { status: 200 }),
    )) as unknown as typeof fetch;
}
