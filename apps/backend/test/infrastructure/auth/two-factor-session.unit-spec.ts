import { Request } from 'express';
import { UserRole } from 'src/domain/user/user-role.enum';
import { hasCompletedTwoFactor } from 'src/infrastructure/auth/two-factor-session';

describe('2FA session authorization', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalDisabled = process.env.TWO_FACTOR_DISABLED;
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    delete process.env.TWO_FACTOR_DISABLED;
  });
  afterEach(() => {
    if (originalNodeEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalNodeEnv;
    if (originalDisabled === undefined) delete process.env.TWO_FACTOR_DISABLED;
    else process.env.TWO_FACTOR_DISABLED = originalDisabled;
  });
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

  it('allows an explicit bypass and requires MFA again when disabled', () => {
    process.env.NODE_ENV = 'production';
    const admin = req(UserRole.ADMIN, null);
    expect(hasCompletedTwoFactor(admin)).toBe(false);
    process.env.TWO_FACTOR_DISABLED = 'true';
    expect(hasCompletedTwoFactor(admin)).toBe(true);
    expect(hasCompletedTwoFactor(req(UserRole.ADMIN, 'v1'))).toBe(true);
    process.env.TWO_FACTOR_DISABLED = 'false';
    expect(hasCompletedTwoFactor(admin)).toBe(false);
  });

  it.each(['development', 'production', 'test', undefined])(
    'honors the bypass in %s',
    (environment) => {
      if (environment === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = environment;
      process.env.TWO_FACTOR_DISABLED = 'true';
      expect(hasCompletedTwoFactor(req(UserRole.ADMIN, null))).toBe(true);
      expect(hasCompletedTwoFactor(req(UserRole.ADMIN, 'v1'))).toBe(true);
    },
  );

  it.each([undefined, 'false', 'TRUE', '1', ''])(
    'keeps production MFA enforced for flag value %s',
    (value) => {
      process.env.NODE_ENV = 'production';
      if (value === undefined) delete process.env.TWO_FACTOR_DISABLED;
      else process.env.TWO_FACTOR_DISABLED = value;
      expect(hasCompletedTwoFactor(req(UserRole.ADMIN, null))).toBe(false);
      expect(hasCompletedTwoFactor(req(UserRole.ADMIN, 'v1'))).toBe(false);
    },
  );
});
