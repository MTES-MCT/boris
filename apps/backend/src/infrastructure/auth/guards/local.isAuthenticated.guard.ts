import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRole } from 'src/domain/user/user-role.enum';

@Injectable()
export class LocalIsAuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    return (
      request.isAuthenticated() &&
      request.user?.isActive === true &&
      request.user?.roles?.includes(UserRole.ADMIN)
    );
  }
}
