import { createHash } from 'crypto';

export function hashResetToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
