import {
  inAuditTransaction,
  auditedUpdate,
} from 'src/infrastructure/audit/audited-write';
import { recordAudit } from 'src/infrastructure/audit/audit.service';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThan, Repository } from 'typeorm';
import { PasswordHasherInterface } from 'src/domain/user/password/password-hasher.interface';
import { UserSessionService } from 'src/infrastructure/session/user-session.service';
import { UserPasswordResetTokenEntity } from 'src/infrastructure/user/user-password-reset-token.entity';
import { hashResetToken } from '../utils/hash-reset-token';

@Injectable()
export class ResetPasswordWithTokenUsecase {
  constructor(
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

    const userId = await inAuditTransaction(
      this.resetTokenRepository.manager,
      async (manager) => {
        const tokens = manager.getRepository(UserPasswordResetTokenEntity);
        const tokenEntity = await tokens.findOne({
          where: {
            tokenHash: hashResetToken(token),
            expiresAt: MoreThan(new Date()),
          },
          lock: { mode: 'pessimistic_write' },
        });
        if (!tokenEntity) throw new BadRequestException();
        const result = await auditedUpdate(
          manager.getRepository(UserEntity),
          { id: tokenEntity.userId, isActive: true },
          { password: await this.passwordHasher.hash(password) },
        );
        if (!result.affected) throw new BadRequestException();
        await tokens.delete({ userId: tokenEntity.userId });
        await recordAudit(manager, {
          type: 'account.password_reset_completed',
          targetType: 'account',
          targetId: tokenEntity.userId,
        });
        return tokenEntity.userId;
      },
    );
    await this.userSessionService.destroyAllForUserId(userId);
  }
}
