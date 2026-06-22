import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { PasswordHasherInterface } from 'src/domain/user/password/password-hasher.interface';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';

@Injectable()
export class ChangePasswordUsecase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('PasswordHasherInterface')
    private readonly passwordHasher: PasswordHasherInterface,
  ) {}

  public async execute(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user || !user.isActive) {
      throw new BadRequestException();
    }

    const isCurrentPasswordValid = await this.passwordHasher.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException();
    }

    user.password = await this.passwordHasher.hash(newPassword);

    await this.userRepository.save(user);
  }
}
