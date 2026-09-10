import { ForbiddenException } from '@nestjs/common';
import { TrustedOriginMiddleware } from 'src/infrastructure/middlewares/trusted-origin.middleware';

describe('TrustedOriginMiddleware', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalAdminAppUrl = process.env.ADMIN_APP_URL;

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
    process.env.ADMIN_APP_URL = 'https://admin.example.fr';
  });

  afterAll(() => {
    process.env.NODE_ENV = originalNodeEnv;
    process.env.ADMIN_APP_URL = originalAdminAppUrl;
  });

  it('rejects an attacker origin sharing an allowed prefix', () => {
    const req = {
      method: 'POST',
      path: '/auth/login',
      get: (name: string) =>
        name === 'origin' ? 'https://admin.example.fr.attacker.com' : undefined,
    };

    expect(() =>
      new TrustedOriginMiddleware().use(req as any, {} as any, jest.fn()),
    ).toThrow(ForbiddenException);
  });

  it('accepts a referer whose parsed origin exactly matches', () => {
    const next = jest.fn();
    const req = {
      method: 'POST',
      path: '/auth/login',
      get: (name: string) =>
        name === 'referer'
          ? 'https://admin.example.fr/login?from=portal'
          : undefined,
    };

    new TrustedOriginMiddleware().use(req as any, {} as any, next);
    expect(next).toHaveBeenCalledTimes(1);
  });
});
