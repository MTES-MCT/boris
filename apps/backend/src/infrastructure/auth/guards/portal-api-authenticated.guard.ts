import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRole } from 'src/domain/user/user-role.enum';

@Injectable()
export class PortalApiAuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    if (
      !request.isAuthenticated() ||
      request.user?.isActive !== true ||
      !request.user?.roles?.some((role: UserRole) =>
        [UserRole.ADMIN, UserRole.OFS].includes(role),
      )
    ) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
