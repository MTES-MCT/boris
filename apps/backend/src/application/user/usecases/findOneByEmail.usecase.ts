import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { FindOneByEmailParams } from './findOneByEmail.params';
import { UserView } from '../views/user.view';

@Injectable()
export class FindOneByEmailUsecase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async execute(params: FindOneByEmailParams): Promise<UserView> {
    const { email } = params;

    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException();
    }

    return new UserView(user.email);
  }
}
