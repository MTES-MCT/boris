import { Request, Response } from 'express';
import {
  auditContextMiddleware,
  currentAuditContext,
} from 'src/infrastructure/audit/audit-context';

describe('Audit request attribution', () => {
  it('uses established Passport identity and requires the final authentication factor', () => {
    const req = {
      method: 'POST',
      route: { path: '/api/portal/auth/login' },
      headers: { 'x-user-id': 'forged', 'x-forwarded-for': '198.51.100.7' },
      body: { actorId: 'forged' },
      user: { id: 'account', roles: ['admin'], twoFactorVersion: 'version' },
      session: { passport: { user: 'account' } },
    } as unknown as Request;
    auditContextMiddleware(req, {} as Response, () => {
      expect(currentAuditContext().actor()).toEqual({ kind: 'anonymous' });
      req.session.twoFactorVerified = { userId: 'account', version: 'version' };
      expect(currentAuditContext().actor()).toEqual({
        kind: 'user',
        id: 'account',
        roles: ['admin'],
      });
      expect(currentAuditContext().request?.()).toEqual({
        httpMethod: 'POST',
        route: '/api/portal/auth/login',
      });
      expect(JSON.stringify(currentAuditContext().request?.())).not.toContain(
        '198.51.100.7',
      );
      delete (req.session as typeof req.session & { passport?: unknown })
        .passport;
      expect(currentAuditContext().actor()).toEqual({ kind: 'anonymous' });
    });
  });
});
