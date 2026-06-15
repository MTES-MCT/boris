import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserRole } from 'src/domain/user/user-role.enum';
import { PortalApiAuthenticatedGuard } from 'src/infrastructure/auth/guards/portal-api-authenticated.guard';

const buildContext = (request: unknown) =>
  ({
    switchToHttp: () => ({
      getRequest: () => request,
    }),
  }) as ExecutionContext;

describe('PortalApiAuthenticatedGuard', () => {
  const guard = new PortalApiAuthenticatedGuard();

  it('allows active commercialisateur portal users', () => {
    const context = buildContext({
      isAuthenticated: () => true,
      user: {
        isActive: true,
        roles: [UserRole.DISTRIBUTOR],
      },
    });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('rejects authenticated users without a portal role', () => {
    const context = buildContext({
      isAuthenticated: () => true,
      user: {
        isActive: true,
        roles: [],
      },
    });

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });
});
