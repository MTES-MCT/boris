import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { DataSource, EntityManager } from 'typeorm';
import { MailerServiceInterface } from 'src/domain/mailer/mailer.service.interface';
import { UserRole } from 'src/domain/user/user-role.enum';
import { hashResetToken } from 'src/application/user/utils/hash-reset-token';
import { OfsEntity } from '../ofs/ofs.entity';
import { UserEntity } from '../user/user.entity';
import { InvitationEntity } from './invitation.entity';
export type InvitationRole = UserRole.OFS | UserRole.DISTRIBUTOR;
const WEEK = 7 * 24 * 60 * 60 * 1000;
@Injectable()
export class InvitationService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject('MailerServiceInterface')
    private readonly mailer: MailerServiceInterface,
  ) {}
  async accessibleOfs(id: string, user: UserEntity) {
    if (
      !user.roles.includes(UserRole.ADMIN) &&
      !(
        user.roles.includes(UserRole.OFS) &&
        user.ofss?.some((ofs) => ofs.id === id)
      )
    ) {
      throw new NotFoundException();
    }
    const ofs = await this.dataSource
      .getRepository(OfsEntity)
      .findOneBy({ id });
    if (!ofs) throw new NotFoundException();
    return ofs;
  }

  async list(ofsId: string, role: InvitationRole) {
    const invitations = await this.dataSource
      .getRepository(InvitationEntity)
      .find({ where: { ofsId, role }, order: { createdAt: 'DESC' } });
    return invitations.map((invitation) => ({
      id: invitation.id,
      name: invitation.name,
      email: invitation.email,
      status:
        invitation.status === 'pending' && invitation.expiresAt <= new Date()
          ? 'expired'
          : invitation.status,
      expiresAt: invitation.expiresAt,
    }));
  }

  async valid(
    manager: EntityManager,
    token: string,
    role: InvitationRole,
    lock = false,
  ) {
    const invitation = await manager.findOne(InvitationEntity, {
      where: { tokenHash: hashResetToken(token), role },
      ...(lock ? { lock: { mode: 'pessimistic_write' as const } } : {}),
    });
    if (
      !invitation ||
      invitation.status !== 'pending' ||
      invitation.expiresAt <= new Date()
    ) {
      throw new BadRequestException(
        'Cette invitation est invalide, expirée, annulée ou déjà acceptée. Demandez à votre OFS de vous envoyer un nouveau lien.',
      );
    }
    return invitation;
  }

  async send(
    manager: EntityManager,
    invitation: InvitationEntity,
    ofsName: string,
  ) {
    const portalUrl = process.env.OFS_PORTAL_URL;
    const templateId = Number(
      (invitation.role === UserRole.OFS
        ? process.env.OFS_INVITATION_TEMPLATE_ID
        : process.env.DISTRIBUTOR_INVITATION_TEMPLATE_ID) || '0',
    );
    if (!portalUrl || !Number.isInteger(templateId) || templateId <= 0) {
      throw new ServiceUnavailableException(
        'L’envoi des invitations n’est pas encore configuré. Contactez l’administration BoRiS.',
      );
    }
    const token = randomBytes(32).toString('base64url');
    invitation.tokenHash = hashResetToken(token);
    invitation.expiresAt = new Date(Date.now() + WEEK);
    await manager.save(invitation);
    await this.mailer.sendEmail(
      [
        {
          email: invitation.email,
          name: invitation.email,
          params: {
            ofsName,
            distributorName: invitation.name,
            invitationUrl: `${portalUrl}/${invitation.role === UserRole.OFS ? 'invitation-ofs' : 'invitation-commercialisateur'}?token=${encodeURIComponent(token)}`,
            expiresInDays: 7,
          },
        },
      ],
      `${ofsName} vous invite sur BoRiS`,
      templateId,
    );
  }
}
