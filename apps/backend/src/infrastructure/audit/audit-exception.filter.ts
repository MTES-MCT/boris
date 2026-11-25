import {
  ArgumentsHost,
  Catch,
  HttpException,
  ExceptionFilter,
} from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Request } from 'express';
import { AuditService } from './audit.service';

@Catch(HttpException)
export class AuditExceptionFilter implements ExceptionFilter<HttpException> {
  constructor(
    private readonly adapter: HttpAdapterHost,
    private readonly audit: AuditService,
  ) {}
  async catch(error: HttpException, host: ArgumentsHost) {
    const req = host.switchToHttp().getRequest<Request>();
    const status = error.getStatus();
    // Session/challenge probes are expected during navigation, not login failures.
    if (
      req.method === 'GET' &&
      /^\/api\/portal\/auth\/(me|two-factor(?:\/enrollment)?)$/.test(req.path)
    ) {
      new BaseExceptionFilter(this.adapter.httpAdapter).catch(error, host);
      return;
    }
    const auth = /^\/(?:api\/portal\/)?auth(?:\/|$)/.test(req.path);
    const loginOperation =
      req.method === 'POST' &&
      /^\/(?:api\/portal\/)?auth\/(login|two-factor)$/.test(req.path);
    const invitation =
      req.method === 'POST' &&
      /^\/api\/portal\/(ofs|distributor)-invitations\/(inspect|accept)$/.test(
        req.path,
      );
    if (
      [401, 403].includes(status) ||
      (auth && status === 400) ||
      (invitation && [400, 409].includes(status))
    ) {
      await this.audit.attempt({
        type: loginOperation
          ? 'auth.login_failed'
          : [401, 403].includes(status)
            ? 'security.access_denied'
            : 'security.request_rejected',
        outcome: status === 401 || status === 403 ? 'denied' : 'failed',
        reasonCode: `HTTP_${status}`,
        metadata: {
          status,
          stage: auth
            ? 'authentication'
            : invitation
              ? 'invitation'
              : 'authorization',
          method: req.method,
          ...(typeof req.route?.path === 'string'
            ? { route: req.route.path.slice(0, 200) }
            : {}),
        },
      });
    }
    new BaseExceptionFilter(this.adapter.httpAdapter).catch(error, host);
  }
}
