import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PasswordHasherInterface } from 'src/domain/user/password/password-hasher.interface';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { generateTemporaryPassword } from '../utils/generate-temporary-password';
import { UserSessionService } from 'src/infrastructure/session/user-session.service';

@Injectable()
export class ResetUserPasswordUsecase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('PasswordHasherInterface')
    private readonly passwordHasher: PasswordHasherInterface,
    private readonly userSessionService: UserSessionService,
  ) {}

  public async execute(userId: string): Promise<string> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundException();
    }

    const generatedPassword = generateTemporaryPassword();

    user.password = await this.passwordHasher.hash(generatedPassword);

    await this.userRepository.save(user);
    await this.userSessionService.destroyAllForUserId(user.id);

    return generatedPassword;
  }
}
