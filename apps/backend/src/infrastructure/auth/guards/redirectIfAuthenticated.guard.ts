import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { UserRole } from 'src/domain/user/user-role.enum';

@Injectable()
export class RedirectIfAuthenticatedGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse<Response>();

    if (req.isAuthenticated()) {
      const user = req.user as UserEntity | undefined;

      if (user?.roles?.includes(UserRole.ADMIN)) {
        res.redirect('/');
      } else {
        res.redirect(process.env.OFS_PORTAL_URL || '/');
      }

      return false;
    }

    return true;
  }
}
