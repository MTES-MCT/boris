import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { FindOneByEmailUsecase } from 'src/application/user/usecases/findOneByEmail.usecase';
import { AuthenticatedUserView } from 'src/application/user/views/authenticated.view';

@Injectable()
export class UserSerializer extends PassportSerializer {
  constructor(private readonly findOneByEmailUseCase: FindOneByEmailUsecase) {
    super();
  }

  serializeUser(user: AuthenticatedUserView, done: Function) {
    done(null, user.email);
  }

  deserializeUser(email: string, done: Function) {
    const user = this.findOneByEmailUseCase.execute(email);

    if (!user) {
      return done(
        `Could not deserialize user: user with email ${email} could not be found`,
        null,
      );
    }

    done(null, user);
  }
}
