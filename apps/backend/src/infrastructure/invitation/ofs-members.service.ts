import { recordAudit } from '../audit/audit.service';
import {
  auditedSave,
  auditedUpdate,
} from 'src/infrastructure/audit/audited-write';
import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { UserRole } from 'src/domain/user/user-role.enum';
import { PasswordHasherInterface } from 'src/domain/user/password/password-hasher.interface';
import { normalizeEmail } from 'src/application/user/utils/normalize-email';
import { OfsEntity } from '../ofs/ofs.entity';
import { UserEntity } from '../user/user.entity';
import { InvitationEntity } from './invitation.entity';
import { InvitationService } from './invitation.service';
import { AcceptOfsInvitationDto } from './ofs-invitation.dto';

@Injectable()
export class OfsMembersService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly invitations: InvitationService,
    @Inject('PasswordHasherInterface')
    private readonly hasher: PasswordHasherInterface,
  ) {}

  async members(ofsId: string) {
    const users = await this.dataSource
      .getRepository(UserEntity)
      .createQueryBuilder('account')
      .innerJoin('account.ofss', 'ofs', 'ofs.id = :ofsId', { ofsId })
      .where('account.isActive = :active', { active: true })
      .andWhere(':role = ANY(account.roles)', { role: UserRole.OFS })
      .select([
        'account.id',
        'account.email',
        'account.firstName',
        'account.lastName',
      ])
      .orderBy('account.lastName', 'ASC')
      .addOrderBy('account.email', 'ASC')
      .getMany();
    return users.map(({ id, firstName, lastName, email }) => ({
      id,
      firstName,
      lastName,
      email,
    }));
  }

  private findUser(manager: EntityManager, email: string) {
    return manager.findOne(UserEntity, {
      where: { email },
      relations: ['ofss'],
    });
  }
  private assertOfsAccount(user: UserEntity) {
    if (
      !user.isActive ||
      user.roles.length !== 1 ||
      user.roles[0] !== UserRole.OFS
    ) {
      throw new ConflictException(
        'Cette adresse est associée à un compte désactivé, administrateur ou commercialisateur. Contactez l’administration BoRiS ou utilisez une autre adresse.',
      );
    }
  }

  async invite(ofs: OfsEntity, rawEmail: string) {
    const email = normalizeEmail(rawEmail);
    return this.dataSource.transaction(async (manager) => {
      await manager.query(
        'SELECT pg_advisory_xact_lock(1781000001, hashtext($1))',
        [`${ofs.id}:${email}`],
      );
      const user = await this.findUser(manager, email);
      if (user) {
        this.assertOfsAccount(user);
        if (user.ofss.some((item) => item.id === ofs.id))
          return {
            message: 'Cette personne fait déjà partie de l’équipe de cet OFS.',
          };
      }
      const pending = await manager.findOneBy(InvitationEntity, {
        ofsId: ofs.id,
        email,
        role: UserRole.OFS,
        status: 'pending',
      });
      if (pending)
        return {
          message:
            'Une invitation existe déjà pour cette adresse. Vous pouvez la renvoyer ou l’annuler ci-dessous.',
        };
      const invitation = manager.create(InvitationEntity, {
        ofsId: ofs.id,
        email,
        role: UserRole.OFS,
        name: '',
        status: 'pending',
        acceptedAt: null,
      });
      await this.invitations.send(manager, invitation, ofs.name);
      return {
        message:
          'Invitation envoyée, valable 7 jours. L’accès sera accordé après acceptation.',
      };
    });
  }

  async manage(ofs: OfsEntity, id: string, action: 'resend' | 'cancel') {
    return this.dataSource.transaction(async (manager) => {
      const invitation = await manager.findOne(InvitationEntity, {
        where: { id, ofsId: ofs.id, role: UserRole.OFS },
        lock: { mode: 'pessimistic_write' },
      });
      if (!invitation) throw new NotFoundException();
      if (invitation.status !== 'pending')
        throw new ConflictException(
          'Cette invitation ne peut plus être modifiée.',
        );
      if (action === 'cancel') {
        invitation.status = 'cancelled';
        await auditedSave(manager.getRepository(InvitationEntity), invitation);
        return {
          message: 'Invitation annulée. Son lien ne peut plus être utilisé.',
        };
      }
      const user = await this.findUser(manager, invitation.email);
      if (user) this.assertOfsAccount(user);
      await this.invitations.send(manager, invitation, ofs.name);
      return {
        message:
          'Invitation renvoyée, valable 7 jours. Le précédent lien est invalidé.',
      };
    });
  }

  async inspect(token: string) {
    const invitation = await this.invitations.valid(
      this.dataSource.manager,
      token,
      UserRole.OFS,
    );
    const ofs = await this.dataSource
      .getRepository(OfsEntity)
      .findOneByOrFail({ id: invitation.ofsId });
    const user = await this.findUser(this.dataSource.manager, invitation.email);
    if (user) this.assertOfsAccount(user);
    return {
      email: invitation.email,
      ofsName: ofs.name,
      existingAccount: !!user,
    };
  }

  async accept(body: AcceptOfsInvitationDto) {
    return this.dataSource.transaction(async (manager) => {
      const invitation = await this.invitations.valid(
        manager,
        body.token,
        UserRole.OFS,
        true,
      );
      // Shared with commercialisateur acceptance: serialize account creation across both flows.
      await manager.query('SELECT pg_advisory_xact_lock(1781000000)');
      if (invitation.expiresAt <= new Date())
        throw new BadRequestException(
          'Cette invitation a expiré. Demandez un nouveau lien.',
        );
      let user = await this.findUser(manager, invitation.email);
      const accountCreated = !user;
      if (user) this.assertOfsAccount(user);
      else {
        const firstName = body.firstName?.trim() || null;
        const lastName = body.lastName?.trim() || null;
        if (!body.password || body.password.length < 12)
          throw new BadRequestException(
            'Choisissez un mot de passe de 12 caractères minimum.',
          );
        user = new UserEntity(
          invitation.email,
          await this.hasher.hash(body.password),
          [UserRole.OFS],
          true,
          [],
        );
        user.firstName = firstName;
        user.lastName = lastName;
        user = await auditedSave(manager.getRepository(UserEntity), user);
      }
      const inserted = await manager.query(
        'INSERT INTO "user_ofs" ("userId", "ofsId") VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING "userId"',
        [user.id, invitation.ofsId],
      );
      if (inserted.length)
        await recordAudit(manager, {
          type: 'account.membership_changed',
          targetType: 'account',
          targetId: user.id,
          ofsId: invitation.ofsId,
          changes: {
            ofsIds: {
              before: user.ofss?.map((ofs) => ofs.id).sort() || [],
              after: [
                ...new Set([
                  ...(user.ofss?.map((ofs) => ofs.id) || []),
                  invitation.ofsId,
                ]),
              ].sort(),
            },
          },
        });
      invitation.status = 'accepted';
      invitation.acceptedAt = new Date();
      await auditedSave(manager.getRepository(InvitationEntity), invitation);
      return {
        accountCreated,
        message: accountCreated
          ? 'Votre compte OFS a été créé. Vous pouvez maintenant vous connecter.'
          : 'Vous avez rejoint l’équipe de cet OFS. Connectez-vous avec votre mot de passe habituel.',
      };
    });
  }

  async updateName(
    userId: string,
    firstName?: string | null,
    lastName?: string | null,
  ) {
    await auditedUpdate(this.dataSource.getRepository(UserEntity), userId, {
      firstName: firstName?.trim() || null,
      lastName: lastName?.trim() || null,
    });
    return { message: 'Votre prénom et votre nom ont été enregistrés.' };
  }
}
