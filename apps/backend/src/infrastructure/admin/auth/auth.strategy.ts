import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginUsecase } from 'src/application/auth/login.usecase';
import { AuthenticatedUserView } from 'src/application/user/views/authenticated.view';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly loginUseCase: LoginUsecase) {
    super({
      usernameField: 'email',
    });
  }

  validate(email: string): AuthenticatedUserView {
    return this.loginUseCase.execute(email);
  }
}
