import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserView } from 'src/application/user/views/user.view';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';

@Injectable()
export class UserSerializer extends PassportSerializer {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {
    super();
  }

  serializeUser(user: UserView, done: Function) {
    done(null, user.email);
  }

  async deserializeUser(email: string, done: Function) {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      return done(
        `Could not deserialize user: user with email ${email} could not be found`,
        null,
      );
    }

    done(null, user);
  }
}
