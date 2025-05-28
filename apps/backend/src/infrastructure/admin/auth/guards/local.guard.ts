import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import messages from 'src/infrastructure/flash/messages';

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
      const request = context.switchToHttp().getRequest();

      request.flash(
        messages.errors.label,
        messages.errors.login.invalidCredentials,
      );

      return true;
    }
  }
}
