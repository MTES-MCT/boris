import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginUsecase } from 'src/application/auth/usecases/login.usecase';
import { UserView } from 'src/application/user/views/user.view';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly loginUseCase: LoginUsecase) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<UserView> {
    return await this.loginUseCase.execute({ email, password });
  }
}
