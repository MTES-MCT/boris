import {
  decryptTotpSecret,
  encryptTotpSecret,
  generateRecoveryCodes,
  generateTotpSecret,
  hashRecoveryCode,
  matchingTotpStep,
  totpAtStep,
} from 'src/infrastructure/auth/two-factor-crypto';

// RFC 6238 Appendix B SHA-1 vectors, reduced to six digits.
const secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';

describe('authenticator credentials', () => {
  const originalKey = process.env.TWO_FACTOR_ENCRYPTION_KEY;
  afterEach(() => {
    if (originalKey === undefined) delete process.env.TWO_FACTOR_ENCRYPTION_KEY;
    else process.env.TWO_FACTOR_ENCRYPTION_KEY = originalKey;
  });

  it.each([
    [59, '287082'],
    [1111111109, '081804'],
    [1111111111, '050471'],
    [1234567890, '005924'],
    [2000000000, '279037'],
    [20000000000, '353130'],
  ])('matches the RFC vector at %s seconds', (seconds, code) => {
    expect(totpAtStep(secret, Math.floor(seconds / 30))).toBe(code);
  });

  it('accepts only six digits within one step of the server clock', () => {
    expect(matchingTotpStep(secret, '287082', 59_000)).toBe(1);
    expect(matchingTotpStep(secret, '287082', 60_000)).toBe(1);
    expect(matchingTotpStep(secret, '287082', 90_000)).toBeNull();
    expect(matchingTotpStep(secret, '28708x', 59_000)).toBeNull();
    expect(matchingTotpStep(secret, '2870820', 59_000)).toBeNull();
  });

  it('generates unique 160-bit Base32 setup keys', () => {
    const secrets = Array.from({ length: 20 }, generateTotpSecret);
    expect(new Set(secrets).size).toBe(20);
    expect(secrets.every((value) => /^[A-Z2-7]{32}$/.test(value))).toBe(true);
  });

  it('encrypts with a random nonce and binds ciphertext to its owner', () => {
    process.env.TWO_FACTOR_ENCRYPTION_KEY = 'ab'.repeat(32);
    const ciphertext = encryptTotpSecret(secret, 'admin');
    expect(ciphertext).not.toContain(secret);
    expect(encryptTotpSecret(secret, 'admin')).not.toBe(ciphertext);
    expect(decryptTotpSecret(ciphertext, 'admin')).toBe(secret);
    expect(() => decryptTotpSecret(ciphertext, 'other-admin')).toThrow();
    const parts = ciphertext.split('.');
    parts[2] = Buffer.alloc(20).toString('base64');
    expect(() => decryptTotpSecret(parts.join('.'), 'admin')).toThrow();
    process.env.TWO_FACTOR_ENCRYPTION_KEY = 'cd'.repeat(32);
    expect(() => decryptTotpSecret(ciphertext, 'admin')).toThrow();
  });

  it('refuses a missing or malformed encryption key', () => {
    delete process.env.TWO_FACTOR_ENCRYPTION_KEY;
    expect(() => encryptTotpSecret(secret, 'admin')).toThrow(
      'TWO_FACTOR_ENCRYPTION_KEY',
    );
    process.env.TWO_FACTOR_ENCRYPTION_KEY = 'too-short';
    expect(() => encryptTotpSecret(secret, 'admin')).toThrow(
      'TWO_FACTOR_ENCRYPTION_KEY',
    );
  });

  it('generates ten unique 128-bit recovery codes with normalized hashes', () => {
    const codes = generateRecoveryCodes();
    expect(new Set(codes).size).toBe(10);
    expect(
      codes.every((code) => /^[a-f0-9]{8}(-[a-f0-9]{8}){3}$/.test(code)),
    ).toBe(true);
    expect(hashRecoveryCode(codes[0])).toBe(
      hashRecoveryCode(codes[0].replace(/-/g, '').toUpperCase()),
    );
    expect(hashRecoveryCode(codes[0])).not.toContain(
      codes[0].replace(/-/g, ''),
    );
  });
});
