import { Injectable, Inject } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { UserEntity } from 'src/infrastructure/user/user.entity';

@Injectable()
export class FindOneByEmailUsecase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public execute(email: string): UserEntity | null {
    return this.userRepository.findOneByEmail(email);
  }
}
