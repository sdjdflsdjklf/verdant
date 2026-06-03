import {
  sha256,
  generateRsaKeyPair,
  exportKeyToPem,
  importPublicKey,
  importPrivateKey,
  signData,
  verifySignature,
} from "./crypto.utils";

jest.setTimeout(30000);

describe("crypto.utils", (): void => {
  describe("sha256", (): void => {
    it("should compute SHA-256 hash of a string", async (): Promise<void> => {
      const hash = await sha256("hello world");
      expect(hash).toBe("b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9");
    });

    it("should produce different hashes for different inputs", async (): Promise<void> => {
      const hash1 = await sha256("abc");
      const hash2 = await sha256("xyz");
      expect(hash1).not.toBe(hash2);
    });

    it("should handle empty string", async (): Promise<void> => {
      const hash = await sha256("");
      expect(hash).toBe("e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
    });

    it("should return 64 hex characters", async (): Promise<void> => {
      const hash = await sha256("test");
      expect(hash).toHaveLength(64);
      expect(/^[a-f0-9]+$/.test(hash)).toBe(true);
    });
  });

  describe("RSA key operations", (): void => {
    let keyPair: Awaited<ReturnType<typeof generateRsaKeyPair>>;

    beforeAll(async (): Promise<void> => {
      keyPair = await generateRsaKeyPair();
    });

    it("should generate an RSA-2048 key pair", (): void => {
      expect(keyPair.publicKey).toBeDefined();
      expect(keyPair.privateKey).toBeDefined();
      expect(keyPair.publicKey.type).toBe("public");
      expect(keyPair.privateKey.type).toBe("private");
    });

    it("should export public key to PEM format", async (): Promise<void> => {
      const pem = await exportKeyToPem(keyPair.publicKey, "spki");
      expect(pem).toContain("-----BEGIN PUBLIC KEY-----");
      expect(pem).toContain("-----END PUBLIC KEY-----");
      expect(pem.length).toBeGreaterThan(200);
    });

    it("should export private key to PEM format", async (): Promise<void> => {
      const pem = await exportKeyToPem(keyPair.privateKey, "pkcs8");
      expect(pem).toContain("-----BEGIN PRIVATE KEY-----");
      expect(pem).toContain("-----END PRIVATE KEY-----");
      expect(pem.length).toBeGreaterThan(500);
    });

    it("should sign and verify data correctly", async (): Promise<void> => {
      const data = "license-key-data-12345";
      const signature = await signData(data, keyPair.privateKey);
      expect(signature).toBeDefined();
      expect(signature.length).toBeGreaterThan(0);

      const isValid = await verifySignature(data, signature, keyPair.publicKey);
      expect(isValid).toBe(true);
    });

    it("should reject tampered data", async (): Promise<void> => {
      const data = "original-data";
      const signature = await signData(data, keyPair.privateKey);

      const isValid = await verifySignature(
        "tampered-data",
        signature,
        keyPair.publicKey,
      );
      expect(isValid).toBe(false);
    });

    it("should import keys from PEM", async (): Promise<void> => {
      const publicPem = await exportKeyToPem(keyPair.publicKey, "spki");
      const privatePem = await exportKeyToPem(keyPair.privateKey, "pkcs8");

      const importedPublic = await importPublicKey(publicPem);
      const importedPrivate = await importPrivateKey(privatePem);

      expect(importedPublic.type).toBe("public");
      expect(importedPrivate.type).toBe("private");

      // Verify the imported keys work
      const data = "test-with-imported-keys";
      const signature = await signData(data, importedPrivate);
      const isValid = await verifySignature(data, signature, importedPublic);
      expect(isValid).toBe(true);
    });
  });

  describe("exportKeyToPem edge cases", (): void => {
    it("should handle empty export (?? [] fallback)", async (): Promise<void> => {
      const exportSpy = jest
        .spyOn(crypto.subtle, "exportKey")
        .mockResolvedValue(new ArrayBuffer(0));

      const keyPair = await generateRsaKeyPair();
      const pem = await exportKeyToPem(keyPair.publicKey, "spki");

      expect(pem).toContain("-----BEGIN PUBLIC KEY-----");
      expect(pem).toContain("-----END PUBLIC KEY-----");

      exportSpy.mockRestore();
    });
  });
});
