import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { LoginParams } from './login.params';
import { PasswordHasherInterface } from 'src/domain/user/password/password-hasher.interface';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { normalizeEmail } from 'src/application/user/utils/normalize-email';

@Injectable()
export class LoginUsecase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('PasswordHasherInterface')
    private readonly passwordHasher: PasswordHasherInterface,
  ) {}

  public async execute({ email, password }: LoginParams): Promise<UserEntity> {
    const user = await this.userRepository.findOneByEmail(
      normalizeEmail(email),
    );

    const isPasswordValid = await this.passwordHasher.compare(
      password,
      user?.password || '',
    );

    if (!user || !user.isActive || !isPasswordValid) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
