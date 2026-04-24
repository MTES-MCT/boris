import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { PasswordHasherInterface } from 'src/domain/user/password/password-hasher.interface';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { UserSessionService } from 'src/infrastructure/session/user-session.service';
import { UserPasswordResetTokenEntity } from 'src/infrastructure/user/user-password-reset-token.entity';
import { hashResetToken } from '../utils/hash-reset-token';

@Injectable()
export class ResetPasswordWithTokenUsecase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('PasswordHasherInterface')
    private readonly passwordHasher: PasswordHasherInterface,
    @InjectRepository(UserPasswordResetTokenEntity)
    private readonly resetTokenRepository: Repository<UserPasswordResetTokenEntity>,
    private readonly userSessionService: UserSessionService,
  ) {}

  public async execute(token: string, password: string): Promise<void> {
    await this.resetTokenRepository.delete({
      expiresAt: LessThanOrEqual(new Date()),
    });

    const tokenEntity = await this.resetTokenRepository.findOne({
      where: {
        tokenHash: hashResetToken(token),
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!tokenEntity) {
      throw new BadRequestException();
    }

    const user = await this.userRepository.findById(tokenEntity.userId);

    if (!user || !user.isActive) {
      await this.resetTokenRepository.delete({ userId: tokenEntity.userId });
      throw new BadRequestException();
    }

    user.password = await this.passwordHasher.hash(password);

    await this.userRepository.save(user);
    await this.resetTokenRepository.delete({ userId: user.id });
    await this.userSessionService.destroyAllForUserId(user.id);
  }
}
