import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'crypto';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateTotpSecret(): string {
  // 160 random bits encoded as the Base32 setup key accepted by authenticators.
  return [...randomBytes(20)]
    .map((byte) => byte.toString(2).padStart(8, '0'))
    .join('')
    .match(/.{5}/g)!
    .map((bits) => alphabet[parseInt(bits, 2)])
    .join('');
}

export function totpAtStep(secret: string, step: number): string {
  if (!/^[A-Z2-7]+$/.test(secret)) throw new Error('Invalid TOTP secret');
  const bits = [...secret]
    .map((character) =>
      alphabet.indexOf(character).toString(2).padStart(5, '0'),
    )
    .join('');
  const key = Buffer.from(
    (bits.match(/.{8}/g) || []).map((byte) => parseInt(byte, 2)),
  );
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(step));
  const digest = createHmac('sha1', key).update(counter).digest();
  const offset = digest[digest.length - 1] & 15;
  const value = digest.readUInt32BE(offset) & 0x7fffffff;
  return (value % 1_000_000).toString().padStart(6, '0');
}

export function matchingTotpStep(
  secret: string,
  code: string,
  now = Date.now(),
): number | null {
  if (!/^\d{6}$/.test(code)) return null;
  const step = Math.floor(now / 30_000);
  for (const candidate of [step, step - 1, step + 1]) {
    if (
      candidate >= 0 &&
      timingSafeEqual(
        Buffer.from(code),
        Buffer.from(totpAtStep(secret, candidate)),
      )
    ) {
      return candidate;
    }
  }
  return null;
}

function encryptionKey(): Buffer {
  const encoded = process.env.TWO_FACTOR_ENCRYPTION_KEY || '';
  if (!/^[a-fA-F0-9]{64}$/.test(encoded)) {
    throw new Error(
      'TWO_FACTOR_ENCRYPTION_KEY must contain 64 hexadecimal characters',
    );
  }
  return Buffer.from(encoded, 'hex');
}

export function encryptTotpSecret(secret: string, userId: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', encryptionKey(), iv);
  cipher.setAAD(Buffer.from(userId));
  const encrypted = Buffer.concat([
    cipher.update(secret, 'utf8'),
    cipher.final(),
  ]);
  return [iv, cipher.getAuthTag(), encrypted]
    .map((part) => part.toString('base64'))
    .join('.');
}

export function decryptTotpSecret(encrypted: string, userId: string): string {
  const [iv, tag, ciphertext] = encrypted
    .split('.')
    .map((part) => Buffer.from(part, 'base64'));
  const decipher = createDecipheriv('aes-256-gcm', encryptionKey(), iv);
  decipher.setAAD(Buffer.from(userId));
  decipher.setAuthTag(tag);
  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString('utf8');
}

export function generateRecoveryCodes(): string[] {
  return Array.from({ length: 10 }, () =>
    randomBytes(16).toString('hex').match(/.{8}/g)!.join('-'),
  );
}

export function hashRecoveryCode(code: string): string {
  return createHash('sha256')
    .update(code.replace(/-/g, '').toLowerCase())
    .digest('hex');
}
