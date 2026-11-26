import { hasCompletedTwoFactor } from '../auth/two-factor-session';
import { AsyncLocalStorage } from 'node:async_hooks';
import { randomUUID } from 'node:crypto';
import { Request, Response, NextFunction } from 'express';
import { UserEntity } from '../user/user.entity';

export type AuditActor = {
  kind: 'user' | 'anonymous' | 'service' | 'operator';
  id?: string;
  ref?: string;
  roles?: string[];
};
export type AuditContext = {
  requestId: string;
  operationId: string;
  actor: () => AuditActor;
  request?: () => { httpMethod: string; route?: string };
};
const context = new AsyncLocalStorage<AuditContext>();

export function currentAuditContext(): AuditContext {
  return (
    context.getStore() || {
      requestId: randomUUID(),
      operationId: randomUUID(),
      actor: () => ({ kind: 'service', ref: 'backend' }),
    }
  );
}

export function withAuditContext<T>(actor: AuditActor, work: () => T): T {
  return context.run(
    { requestId: randomUUID(), operationId: randomUUID(), actor: () => actor },
    work,
  );
}

export function auditContextMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  context.run(
    {
      requestId: randomUUID(),
      operationId: randomUUID(),
      request: () => ({
        httpMethod: req.method,
        ...(typeof req.route?.path === 'string'
          ? { route: req.route.path.slice(0, 200) }
          : {}),
      }),
      actor: () => {
        const user = req.user as UserEntity | undefined;
        const pending =
          req.session?.pendingTwoFactor ||
          req.session?.pendingTwoFactorEnrollmentLogin;
        const passportUser = (
          req.session as
            | (typeof req.session & { passport?: { user?: string } })
            | undefined
        )?.passport?.user;
        return user?.id &&
          passportUser === user.id &&
          !pending &&
          hasCompletedTwoFactor(req)
          ? { kind: 'user', id: user.id, roles: user.roles }
          : { kind: 'anonymous' };
      },
    },
    next,
  );
}
