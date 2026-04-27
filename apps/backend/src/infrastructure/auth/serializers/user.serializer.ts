import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { UserEntity } from 'src/infrastructure/user/user.entity';

@Injectable()
export class UserSerializer extends PassportSerializer {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {
    super();
  }

  serializeUser(user: UserEntity, done: Function) {
    done(null, user.id);
  }

  async deserializeUser(userId: string, done: Function) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      return done(
        `Could not deserialize user: user with id ${userId} could not be found`,
        null,
      );
    }

    done(null, user);
  }
}
