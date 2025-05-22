import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { AuthenticatedUserView } from '../user/views/authenticated.view';

@Injectable()
export class LoginUsecase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public execute(email: string): AuthenticatedUserView {
    const user = this.userRepository.findOneByEmail(email.toLowerCase());

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return new AuthenticatedUserView(user.email);
  }
}
