import { Request } from 'express';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from 'src/domain/user/user-role.enum';
import { hasCompletedTwoFactor } from '../two-factor-session';

@Injectable()
export class LocalIsAuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: UserEntity }>();

    return (
      request.isAuthenticated() &&
      request.user?.isActive === true &&
      request.user?.roles?.includes(UserRole.ADMIN) &&
      hasCompletedTwoFactor(request)
    );
  }
}
