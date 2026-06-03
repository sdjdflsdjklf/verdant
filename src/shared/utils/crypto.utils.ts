/**
 * Compute SHA-256 hex digest of a string.
 * Uses the Web Crypto API (available in modern browsers / Electron / Obsidian mobile).
 */
export async function sha256(content: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export interface RsaKeyPair {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}

export type KeyFormat = "spki" | "pkcs8";

/**
 * Generate an RSA-2048 key pair for license signing/verification.
 */
export async function generateRsaKeyPair(): Promise<RsaKeyPair> {
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"],
  );

  return {
    publicKey: keyPair.publicKey,
    privateKey: keyPair.privateKey,
  };
}

/**
 * Export a CryptoKey to PEM-encoded string.
 */
export async function exportKeyToPem(
  key: CryptoKey,
  format: KeyFormat,
): Promise<string> {
  const exported = await crypto.subtle.exportKey(format, key);
  const exportedArray = Array.from(new Uint8Array(exported));
  const binary = String.fromCharCode(...exportedArray);
  const base64 = btoa(binary);

  const label = format === "spki" ? "PUBLIC KEY" : "PRIVATE KEY";
  const lines = base64.match(/.{1,64}/g) ?? [];
  return [`-----BEGIN ${label}-----`, ...lines, `-----END ${label}-----`].join(
    "\n",
  );
}

/**
 * Import a PEM-encoded public key for verification.
 */
export async function importPublicKey(pem: string): Promise<CryptoKey> {
  const pemData = pem
    .replace(/-----BEGIN PUBLIC KEY-----/, "")
    .replace(/-----END PUBLIC KEY-----/, "")
    .replace(/\s+/g, "");
  const binaryDer = Uint8Array.from(atob(pemData), (c) => c.charCodeAt(0));

  return await crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    true,
    ["verify"],
  );
}

/**
 * Import a PEM-encoded private key for signing.
 */
export async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const pemData = pem
    .replace(/-----BEGIN PRIVATE KEY-----/, "")
    .replace(/-----END PRIVATE KEY-----/, "")
    .replace(/\s+/g, "");
  const binaryDer = Uint8Array.from(atob(pemData), (c) => c.charCodeAt(0));

  return await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    true,
    ["sign"],
  );
}

/**
 * Sign data using RSA private key.
 * Returns base64-encoded signature.
 */
export async function signData(
  data: string,
  privateKey: CryptoKey,
): Promise<string> {
  const encoder = new TextEncoder();
  const signature = await crypto.subtle.sign(
    {
      name: "RSASSA-PKCS1-v1_5",
    },
    privateKey,
    encoder.encode(data),
  );
  const sigArray = Array.from(new Uint8Array(signature));
  const binary = String.fromCharCode(...sigArray);
  return btoa(binary);
}

/**
 * Verify a base64-encoded signature against data using an RSA public key.
 */
export async function verifySignature(
  data: string,
  signatureBase64: string,
  publicKey: CryptoKey,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const signature = Uint8Array.from(atob(signatureBase64), (c) =>
    c.charCodeAt(0),
  );

  return await crypto.subtle.verify(
    {
      name: "RSASSA-PKCS1-v1_5",
    },
    publicKey,
    signature,
    encoder.encode(data),
  );
}
