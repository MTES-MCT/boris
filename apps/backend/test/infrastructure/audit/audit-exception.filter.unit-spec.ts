import { ArgumentsHost, HttpException } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { AuditExceptionFilter } from 'src/infrastructure/audit/audit-exception.filter';
import { AuditService } from 'src/infrastructure/audit/audit.service';

describe('Audit security failure classification', () => {
  it.each([
    ['/api/portal/auth/me', 'GET', 401, null],
    ['/api/portal/auth/two-factor', 'GET', 401, null],
    ['/missing-public-page', 'GET', 404, null],
    ['/api/portal/auth/login', 'POST', 401, 'auth.login_failed'],
    [
      '/api/portal/auth/two-factor/disable',
      'POST',
      403,
      'security.access_denied',
    ],
    [
      '/api/portal/ofs-invitations/accept',
      'POST',
      400,
      'security.request_rejected',
    ],
  ])(
    'classifies %s %s (%i) without copying secrets',
    async (path, method, status, type) => {
      const attempt = jest.fn().mockResolvedValue(undefined);
      const adapter = { isHeadersSent: () => false, reply: jest.fn() };
      const req = {
        path,
        method,
        route: { path },
        body: { password: 'secret', token: 'secret-token' },
        headers: { 'x-forwarded-for': '198.51.100.2' },
      };
      const response = {};
      const host = {
        switchToHttp: () => ({ getRequest: () => req }),
        getArgByIndex: () => response,
      } as unknown as ArgumentsHost;
      const adapterHost = new HttpAdapterHost();
      // Nest can construct providers before attaching the application adapter.
      const filter = new AuditExceptionFilter(adapterHost, {
        attempt,
      } as unknown as AuditService);
      adapterHost.httpAdapter =
        adapter as unknown as HttpAdapterHost['httpAdapter'];
      await filter.catch(new HttpException('Rejected', status), host);
      if (type) {
        expect(attempt).toHaveBeenCalledWith(
          expect.objectContaining({
            type,
            metadata: expect.objectContaining({ route: path }),
          }),
        );
        expect(JSON.stringify(attempt.mock.calls)).not.toMatch(
          /secret|198\.51\.100\.2/,
        );
      } else expect(attempt).not.toHaveBeenCalled();
      expect(adapter.reply).toHaveBeenCalledWith(
        response,
        expect.anything(),
        status,
      );
    },
  );
});
