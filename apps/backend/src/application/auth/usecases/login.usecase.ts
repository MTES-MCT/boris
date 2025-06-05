import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { UserView } from '../../user/views/user.view';
import { LoginParams } from './login.params';

@Injectable()
export class LoginUsecase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public execute({ email, password }: LoginParams): UserView {
    const user = this.userRepository.findOneByEmail(email.toLowerCase());
    console.log(password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return new UserView(user.email);
  }
}
