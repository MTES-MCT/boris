import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { RequestWithFlash } from 'src/types/request-with-flash';
import translations from 'src/views/utils/translations';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor() {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      await super.canActivate(context);
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);

      return true;
    } catch (e) {
      console.log(e);
      const res: Response = context.switchToHttp().getResponse();
      const req: Request = context.switchToHttp().getRequest();

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
