import { randomBytes } from 'crypto';

export function generateTemporaryPassword(): string {
  return randomBytes(12).toString('base64url');
}
