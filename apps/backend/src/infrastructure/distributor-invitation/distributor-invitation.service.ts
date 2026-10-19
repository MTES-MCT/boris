import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { DataSource, EntityManager } from 'typeorm';
import { MailerServiceInterface } from 'src/domain/mailer/mailer.service.interface';
import { PasswordHasherInterface } from 'src/domain/user/password/password-hasher.interface';
import { UserRole } from 'src/domain/user/user-role.enum';
import { normalizeEmail } from 'src/application/user/utils/normalize-email';
import { hashResetToken } from 'src/application/user/utils/hash-reset-token';
import { OfsEntity } from '../ofs/ofs.entity';
import { UserEntity } from '../user/user.entity';
import { DistributorEntity } from '../distributor/distributor.entity';
import { DistributorInvitationEntity } from './distributor-invitation.entity';
import {
  AcceptDistributorInvitationDto,
  InviteDistributorDto,
} from './distributor-invitation.dto';
import {
  matchDistributors,
  normalizeDistributorName,
} from './distributor-name-matching';

const WEEK = 7 * 24 * 60 * 60 * 1000;
const summary = (distributor: DistributorEntity) => ({
  id: distributor.id,
  name: distributor.name,
});

@Injectable()
export class DistributorInvitationService {
  constructor(
    private readonly dataSource: DataSource,
    @Inject('MailerServiceInterface')
    private readonly mailer: MailerServiceInterface,
    @Inject('PasswordHasherInterface')
    private readonly hasher: PasswordHasherInterface,
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

  async search(name: string, manager = this.dataSource.manager) {
    const distributors = await manager.find(DistributorEntity, {
      select: ['id', 'name'],
      order: { name: 'ASC' },
    });
    return matchDistributors(name.slice(0, 200), distributors).map(summary);
  }

  async list(ofsId: string) {
    const invitations = await this.dataSource
      .getRepository(DistributorInvitationEntity)
      .find({ where: { ofsId }, order: { createdAt: 'DESC' } });
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

  async linkedDistributors(ofsId: string) {
    const rows = await this.dataSource
      .getRepository(DistributorEntity)
      .createQueryBuilder('distributor')
      .innerJoin('distributor.ofss', 'ofs', 'ofs.id = :ofsId', { ofsId })
      .leftJoin(
        UserEntity,
        'account',
        'account.distributor = distributor.id AND account.isActive = :active AND :role = ANY(account.roles)',
        { active: true, role: UserRole.DISTRIBUTOR },
      )
      .select('distributor.id', 'id')
      .addSelect('distributor.name', 'name')
      .addSelect('account.email', 'email')
      .orderBy('distributor.name', 'ASC')
      .addOrderBy('account.email', 'ASC')
      .getRawMany<{ id: string; name: string; email: string | null }>();

    const distributors = new Map<
      string,
      { id: string; name: string; emails: string[] }
    >();
    for (const row of rows) {
      let distributor = distributors.get(row.id);
      if (!distributor) {
        distributor = { id: row.id, name: row.name, emails: [] };
        distributors.set(row.id, distributor);
      }
      if (row.email) distributor.emails.push(row.email);
    }
    return [...distributors.values()];
  }

  async link(ofsId: string, distributorId: string) {
    const distributor = await this.dataSource
      .getRepository(DistributorEntity)
      .findOneBy({ id: distributorId });
    if (!distributor) throw new NotFoundException();
    await this.addLink(this.dataSource.manager, ofsId, distributorId);
    return {
      kind: 'linked',
      distributor: summary(distributor),
      message: `${distributor.name} est rattaché à votre OFS. Aucun compte ni invitation n'a été créé. Vous pouvez maintenant configurer une transmission commerciale.`,
    };
  }

  async invite(ofs: OfsEntity, body: InviteDistributorDto) {
    if (!normalizeDistributorName(body.name))
      throw new BadRequestException('Indiquez un nom de commercialisateur.');
    return this.dataSource.transaction(async (manager) => {
      const email = normalizeEmail(body.email);
      // Only invitations for the same OFS/email need to serialize during delivery.
      await manager.query(
        'SELECT pg_advisory_xact_lock(1781000001, hashtext($1))',
        [`${ofs.id}:${email}`],
      );
      const user = await this.findUser(manager, email);
      if (user) {
        this.assertResellerAccount(user);
        await this.addLink(manager, ofs.id, user.distributor!.id);
        return {
          kind: 'linked',
          distributor: summary(user.distributor!),
          message: `Cette adresse appartient déjà à ${user.distributor!.name}. Ce commercialisateur est rattaché à votre OFS, sans création de compte ni invitation. Vous pouvez maintenant configurer une transmission commerciale.`,
        };
      }
      const pending = await manager.findOneBy(DistributorInvitationEntity, {
        ofsId: ofs.id,
        email,
        status: 'pending',
      });
      if (pending) {
        return {
          kind: 'pending',
          message:
            'Une invitation existe déjà pour cette adresse. Vous pouvez la renvoyer ou l’annuler dans la liste ci-dessous.',
        };
      }
      const invitation = manager.create(DistributorInvitationEntity, {
        ofsId: ofs.id,
        name: body.name.trim(),
        email,
        status: 'pending',
        acceptedAt: null,
      });
      await this.send(manager, invitation, ofs.name);
      return {
        kind: 'invited',
        message:
          'Invitation envoyée, valable 7 jours. Le commercialisateur et son compte seront créés à l’acceptation. Aucun contact ne sera transmis automatiquement.',
      };
    });
  }

  async manage(ofs: OfsEntity, id: string, action: 'resend' | 'cancel') {
    return this.dataSource.transaction(async (manager) => {
      const invitation = await manager.findOne(DistributorInvitationEntity, {
        where: { id, ofsId: ofs.id },
        lock: { mode: 'pessimistic_write' },
      });
      if (!invitation) throw new NotFoundException();
      if (invitation.status !== 'pending')
        throw new ConflictException(
          'Cette invitation ne peut plus être modifiée.',
        );
      if (action === 'cancel') {
        invitation.status = 'cancelled';
        await manager.save(invitation);
        return {
          message: 'Invitation annulée. Son lien ne peut plus être utilisé.',
        };
      }
      const user = await this.findUser(manager, invitation.email);
      if (user) {
        this.assertResellerAccount(user);
        await this.addLink(manager, ofs.id, user.distributor!.id);
        invitation.status = 'accepted';
        invitation.acceptedAt = new Date();
        await manager.save(invitation);
        return {
          message: `Cette adresse appartient désormais à ${user.distributor!.name}. Ce commercialisateur est rattaché à votre OFS, sans création de compte ni nouvel envoi.`,
        };
      }
      await this.send(manager, invitation, ofs.name);
      return {
        message:
          'Invitation renvoyée, valable 7 jours. Le précédent lien est invalidé.',
      };
    });
  }

  async inspect(token: string) {
    const invitation = await this.validInvitation(
      this.dataSource.manager,
      token,
    );
    const ofs = await this.dataSource
      .getRepository(OfsEntity)
      .findOneByOrFail({ id: invitation.ofsId });
    const user = await this.findUser(this.dataSource.manager, invitation.email);
    if (user) this.assertResellerAccount(user);
    return {
      name: invitation.name,
      email: invitation.email,
      ofsName: ofs.name,
      existingDistributor: user?.distributor ? summary(user.distributor) : null,
      matches: user ? [] : await this.search(invitation.name),
    };
  }

  async accept(body: AcceptDistributorInvitationDto) {
    // Serialize invitation acceptance so two invitations cannot create the same organization concurrently.
    return this.dataSource.transaction(async (manager) => {
      const invitation = await this.validInvitation(manager, body.token, true);
      await this.lock(manager);
      if (invitation.expiresAt <= new Date()) {
        throw new BadRequestException(
          'Cette invitation a expiré. Demandez à votre OFS de vous envoyer un nouveau lien.',
        );
      }
      const user = await this.findUser(manager, invitation.email);
      let distributor: DistributorEntity;
      let accountCreated = false;
      if (user) {
        this.assertResellerAccount(user);
        distributor = user.distributor!;
      } else {
        const matches = await this.search(invitation.name, manager);
        if (body.distributorId) {
          if (!matches.some((match) => match.id === body.distributorId))
            throw new BadRequestException(
              'Sélectionnez un commercialisateur suggéré.',
            );
          distributor = await manager.findOneByOrFail(DistributorEntity, {
            id: body.distributorId,
          });
        } else {
          if (
            matches.length &&
            (!body.createNew ||
              matches.some(
                (match) => !body.reviewedMatchIds?.includes(match.id),
              ))
          ) {
            throw new ConflictException(
              'Des commercialisateurs similaires existent. Vérifiez les suggestions avant de continuer.',
            );
          }
          if (!body.password || body.password.length < 12)
            throw new BadRequestException(
              'Choisissez un mot de passe de 12 caractères minimum.',
            );
          distributor = await manager.save(
            new DistributorEntity(invitation.name, '', []),
          );
          await manager.save(
            new UserEntity(
              invitation.email,
              await this.hasher.hash(body.password),
              [UserRole.DISTRIBUTOR],
              true,
              [],
              distributor,
            ),
          );
          accountCreated = true;
        }
      }
      await this.addLink(manager, invitation.ofsId, distributor.id);
      invitation.status = 'accepted';
      invitation.acceptedAt = new Date();
      await manager.save(invitation);
      return {
        distributor: summary(distributor),
        accountCreated,
        message: accountCreated
          ? 'Votre compte commercialisateur a été créé. Vous pouvez maintenant vous connecter. Les contacts seront visibles après configuration d’une transmission par l’OFS.'
          : `${distributor.name} est rattaché à l’OFS. Aucun compte n’a été créé. Si vous n’avez pas déjà accès à ce commercialisateur, contactez l’administration BoRiS pour demander votre rattachement.`,
      };
    });
  }

  private async validInvitation(
    manager: EntityManager,
    token: string,
    lock = false,
  ) {
    const invitation = await manager.findOne(DistributorInvitationEntity, {
      where: { tokenHash: hashResetToken(token) },
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

  private findUser(manager: EntityManager, email: string) {
    return manager.findOne(UserEntity, {
      where: { email },
      relations: ['distributor'],
    });
  }

  private assertResellerAccount(user: UserEntity) {
    if (
      user.roles.length !== 1 ||
      user.roles[0] !== UserRole.DISTRIBUTOR ||
      !user.distributor
    ) {
      throw new ConflictException(
        'Cette adresse est déjà associée à un compte OFS ou administrateur et ne peut pas devenir un compte commercialisateur. Utilisez une autre adresse e-mail.',
      );
    }
    if (!user.isActive)
      throw new ConflictException(
        'Ce compte commercialisateur est désactivé. Contactez l’administration BoRiS.',
      );
  }

  private async addLink(
    manager: EntityManager,
    ofsId: string,
    distributorId: string,
  ) {
    await manager.query(
      'INSERT INTO "ofs_distributor" ("ofsId", "distributorId") VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [ofsId, distributorId],
    );
  }

  private async lock(manager: EntityManager) {
    await manager.query('SELECT pg_advisory_xact_lock(1781000000)');
  }

  private async send(
    manager: EntityManager,
    invitation: DistributorInvitationEntity,
    ofsName: string,
  ) {
    const portalUrl = process.env.OFS_PORTAL_URL;
    const templateId = Number(
      process.env.DISTRIBUTOR_INVITATION_TEMPLATE_ID || '0',
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
            invitationUrl: `${portalUrl}/invitation-commercialisateur?token=${encodeURIComponent(token)}`,
            expiresInDays: 7,
          },
        },
      ],
      `${ofsName} vous invite sur BoRiS`,
      templateId,
    );
  }
}
