import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { SaveUserParams } from './save.params';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { PasswordHasherInterface } from 'src/domain/user/password/password-hasher.interface';
import { UserView } from '../views/user.view';
import { normalizeEmail } from '../utils/normalize-email';
import { UserRole } from 'src/domain/user/user-role.enum';

@Injectable()
export class SaveUserUseCase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('PasswordHasherInterface')
    private readonly passwordHasher: PasswordHasherInterface,
  ) {}

  public async execute(params: SaveUserParams): Promise<UserView> {
    const email = normalizeEmail(params.email);
    const { password } = params;

    const existingUser = await this.userRepository.findOneByEmail(email);

    if (existingUser) {
      throw new ConflictException();
    }

    const hashedPassword = await this.passwordHasher.hash(password);

    const user = await this.userRepository.save(
      new UserEntity(email, hashedPassword, [UserRole.ADMIN]),
    );

    return new UserView(user.id, user.email, user.roles, user.isActive);
  }
}
