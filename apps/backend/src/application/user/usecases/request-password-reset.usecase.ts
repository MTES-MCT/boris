import { Inject, Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerServiceInterface } from 'src/domain/mailer/mailer.service.interface';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { normalizeEmail } from '../utils/normalize-email';
import { hashResetToken } from '../utils/hash-reset-token';
import { UserPasswordResetTokenEntity } from 'src/infrastructure/user/user-password-reset-token.entity';

@Injectable()
export class RequestPasswordResetUsecase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
    @Inject('MailerServiceInterface')
    private readonly mailerService: MailerServiceInterface,
    @InjectRepository(UserPasswordResetTokenEntity)
    private readonly resetTokenRepository: Repository<UserPasswordResetTokenEntity>,
  ) {}

  public async execute(email: string): Promise<void> {
    const user = await this.userRepository.findOneByEmail(
      normalizeEmail(email),
    );

    if (!user || !user.isActive) {
      return;
    }

    await this.resetTokenRepository.delete({ userId: user.id });

    const rawToken = randomBytes(32).toString('base64url');

    await this.resetTokenRepository.save(
      new UserPasswordResetTokenEntity(
        hashResetToken(rawToken),
        new Date(Date.now() + 1000 * 60 * 60),
        user.id,
      ),
    );

    const portalUrl = process.env.OFS_PORTAL_URL;
    const templateId = Number(process.env.PASSWORD_RESET_TEMPLATE_ID || '0');

    if (!portalUrl || !templateId) {
      return;
    }

    await this.mailerService.sendEmail(
      [
        {
          email: user.email,
          name: user.email,
          params: {
            resetUrl: `${portalUrl}/reinitialisation-mot-de-passe?token=${encodeURIComponent(rawToken)}`,
          },
        },
      ],
      'Réinitialisation de votre mot de passe BoRiS',
      templateId,
    );
  }
}
