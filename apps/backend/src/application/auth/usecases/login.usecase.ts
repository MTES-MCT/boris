import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { UserView } from '../../user/views/user.view';
import { LoginParams } from './login.params';
import { PasswordHasherInterface } from 'src/domain/user/password/password-hasher.interface';

@Injectable()
export class LoginUsecase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('PasswordHasherInterface')
    private readonly passwordHasher: PasswordHasherInterface,
  ) {}

  public async execute({ email, password }: LoginParams): Promise<UserView> {
    const user = await this.userRepository.findOneByEmail(email.toLowerCase());

    const isPasswordValid = await this.passwordHasher.compare(
      password,
      user?.password || '',
    );

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException();
    }

    return new UserView(user.email);
  }
}
