import { Request } from 'express';
import { UserRole } from 'src/domain/user/user-role.enum';
import { UserEntity } from '../user/user.entity';

declare module 'express-session' {
  interface SessionData {
    pendingTwoFactor?: { userId: string; version: string; expiresAt: number };
    twoFactorVerified?: { userId: string; version: string };
    previousLoginAt?: string | null;
  }
}

export function requiresTwoFactor(user: UserEntity): boolean {
  return user.roles.includes(UserRole.ADMIN) || !!user.twoFactorVersion;
}

export function hasCompletedTwoFactor(req: Request): boolean {
  const user = req.user as UserEntity | undefined;
  if (!user) return false;
  if (!requiresTwoFactor(user)) return true;
  return (
    !!user.twoFactorVersion &&
    req.session?.twoFactorVerified?.userId === user.id &&
    req.session.twoFactorVerified.version === user.twoFactorVersion
  );
}
