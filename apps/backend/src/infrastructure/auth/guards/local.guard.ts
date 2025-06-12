import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { FlashMessageFactory } from 'src/views/factories/flash-message.factories';
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

      const flashMessage = FlashMessageFactory.createFlashMessage({
        type: 'error',
        message: translations.error.login.invalidCredentials,
      });

      req.flash(flashMessage.type, flashMessage.message);

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
