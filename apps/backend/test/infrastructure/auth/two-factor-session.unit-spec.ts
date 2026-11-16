import { Request } from 'express';
import { UserRole } from 'src/domain/user/user-role.enum';
import { hasCompletedTwoFactor } from 'src/infrastructure/auth/two-factor-session';

describe('2FA session authorization', () => {
  const req = (
    role: UserRole,
    version: string | null,
    proof?: { userId: string; version: string },
  ) =>
    ({
      user: { id: 'admin', roles: [role], twoFactorVersion: version },
      session: { twoFactorVerified: proof },
    }) as unknown as Request;

  it('rejects unprovisioned admins and existing password-only admin sessions', () => {
    expect(hasCompletedTwoFactor(req(UserRole.ADMIN, null))).toBe(false);
    expect(hasCompletedTwoFactor(req(UserRole.ADMIN, 'v1'))).toBe(false);
  });

  it('accepts only a proof matching both account and current credentials', () => {
    expect(
      hasCompletedTwoFactor(
        req(UserRole.ADMIN, 'v1', { userId: 'admin', version: 'v1' }),
      ),
    ).toBe(true);
    expect(
      hasCompletedTwoFactor(
        req(UserRole.ADMIN, 'v2', { userId: 'admin', version: 'v1' }),
      ),
    ).toBe(false);
    expect(
      hasCompletedTwoFactor(
        req(UserRole.ADMIN, 'v1', { userId: 'other', version: 'v1' }),
      ),
    ).toBe(false);
  });

  it('leaves unenrolled OFS accounts alone and supports future optional enrollment', () => {
    expect(hasCompletedTwoFactor(req(UserRole.OFS, null))).toBe(true);
    expect(hasCompletedTwoFactor(req(UserRole.OFS, 'v1'))).toBe(false);
    expect(
      hasCompletedTwoFactor(
        req(UserRole.OFS, 'v1', { userId: 'admin', version: 'v1' }),
      ),
    ).toBe(true);
    expect(hasCompletedTwoFactor(req(UserRole.DISTRIBUTOR, null))).toBe(true);
  });
});
