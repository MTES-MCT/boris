import {
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { RequestWithFlash } from 'src/types/request-with-flash';
import translations from 'src/views/utils/translations';
import { AuthRateLimitService } from '../auth-rate-limit.service';
import { normalizeEmail } from 'src/application/user/utils/normalize-email';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { TwoFactorService } from '../two-factor.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(
    private readonly authRateLimitService: AuthRateLimitService,
    private readonly twoFactor: TwoFactorService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const email = normalizeEmail(`${req.body?.email || ''}`);
    const ip = req.ip || 'unknown';

    try {
      await this.authRateLimitService.consume(
        `login:email:${email}`,
        5,
        15 * 60 * 1000,
      );
      await this.authRateLimitService.consume(
        `login:ip:${ip}`,
        5,
        15 * 60 * 1000,
      );

      await super.canActivate(context);
      const request = context.switchToHttp().getRequest<Request>();
      await this.twoFactor.start(request, request.user as UserEntity);

      await this.authRateLimitService.clear(`login:email:${email}`);
      await this.authRateLimitService.clear(`login:ip:${ip}`);

      return true;
    } catch (e) {
      const status =
        e instanceof Error && 'getStatus' in e
          ? (e as { getStatus(): number }).getStatus()
          : 500;
      if (status !== 429) await this.twoFactor.recordFailure(status, req);
      const res: Response = context.switchToHttp().getResponse();
      if (!req.session) {
        res.redirect(303, '/auth/login');
        return false;
      }

      (req as RequestWithFlash).flash(
        translations.error.defaultLabel,
        e instanceof ForbiddenException
          ? 'La double authentification doit être configurée. Connectez-vous à l’espace OFS pour configurer votre application d’authentification.'
          : translations.error.login.invalidCredentials,
      );

      await new Promise<void>((resolve) => {
        req.session.save(() => {
          res.redirect(303, '/auth/login');
          resolve();
        });
      });

      return false;
    }
  }
}
