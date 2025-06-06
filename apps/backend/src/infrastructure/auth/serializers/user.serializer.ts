import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { FindOneByEmailUsecase } from 'src/application/user/usecases/findOneByEmail.usecase';
import { UserView } from 'src/application/user/views/user.view';

@Injectable()
export class UserSerializer extends PassportSerializer {
  constructor(private readonly findOneByEmailUseCase: FindOneByEmailUsecase) {
    super();
  }

  serializeUser(user: UserView, done: Function) {
    done(null, user.email);
  }

  async deserializeUser(email: string, done: Function) {
    const user = await this.findOneByEmailUseCase.execute({ email });

    if (!user) {
      return done(
        `Could not deserialize user: user with email ${email} could not be found`,
        null,
      );
    }

    done(null, user);
  }
}
