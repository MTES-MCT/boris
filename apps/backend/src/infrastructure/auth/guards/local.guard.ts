import { ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { RequestWithFlash } from 'src/types/request-with-flash';
import translations from 'src/views/utils/translations';
import { AuthRateLimitService } from '../auth-rate-limit.service';
import { normalizeEmail } from 'src/application/user/utils/normalize-email';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { regenerateSession } from 'src/infrastructure/session/regenerate-session';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(
    private readonly authRateLimitService: AuthRateLimitService,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
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
      await regenerateSession(request);
      await super.logIn(request);

      const user = request.user as UserEntity;
      const session = request.session as typeof request.session & {
        previousLoginAt?: string | null;
      };

      session.previousLoginAt = user.lastLoginAt?.toISOString() || null;
      user.lastLoginAt = new Date();
      await this.userRepository.save(user);

      await this.authRateLimitService.clear(`login:email:${email}`);
      await this.authRateLimitService.clear(`login:ip:${ip}`);

      return true;
    } catch (e) {
      console.log(e);
      const res: Response = context.switchToHttp().getResponse();

      (req as RequestWithFlash).flash(
        translations.error.defaultLabel,
        translations.error.login.invalidCredentials,
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
