import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { Request, Response, NextFunction } from 'express';
import { Server } from 'http';
import {
  OfsMembersController,
  AccountNameController,
} from 'src/infrastructure/invitation/ofs-members.controller';
import { AuthRateLimitService } from 'src/infrastructure/auth/auth-rate-limit.service';
import { createValidationPipe } from 'src/infrastructure/config/validation-pipe.config';
import { ConflictException } from '@nestjs/common';
import { OfsMembersService } from 'src/infrastructure/invitation/ofs-members.service';
import { SharePortalInvitations1795200000000 } from 'src/infrastructure/persistence/migrations/1795200000000-share_portal_invitations';
import { InvitationService } from 'src/infrastructure/invitation/invitation.service';
import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { DistributorInvitationService } from 'src/infrastructure/distributor-invitation/distributor-invitation.service';
import { InvitationEntity } from 'src/infrastructure/invitation/invitation.entity';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { UserRole } from 'src/domain/user/user-role.enum';
import { CreateDistributorInvitations1793000000000 } from 'src/infrastructure/persistence/migrations/1793000000000-create_distributor_invitations';

const databaseUrl = process.env.DISTRIBUTOR_INVITATION_TEST_DATABASE_URL;
const describeDatabase = databaseUrl ? describe : describe.skip;

describeDatabase(
  'Portal invitation transactions (PostgreSQL, isolated schema)',
  () => {
    const schema = `invitation_test_${randomUUID().replace(/-/g, '')}`;
    let admin: DataSource;
    let database: DataSource;
    let service: DistributorInvitationService;
    let members: OfsMembersService;
    let ofs: OfsEntity;
    const sendEmail = jest.fn();
    const oldConfig = {
      portal: process.env.OFS_PORTAL_URL,
      template: process.env.DISTRIBUTOR_INVITATION_TEMPLATE_ID,
      ofsTemplate: process.env.OFS_INVITATION_TEMPLATE_ID,
    };

    beforeAll(async () => {
      admin = await new DataSource({
        type: 'postgres',
        url: databaseUrl,
      }).initialize();
      await admin.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
      await admin.query(`CREATE SCHEMA "${schema}"`);
      database = await new DataSource({
        type: 'postgres',
        url: databaseUrl,
        schema,
        entities: typeormConfig.entities,
        extra: { options: `-c search_path=${schema},public` },
      }).initialize();
      await database.synchronize();
      const runner = database.createQueryRunner();
      const migration = new CreateDistributorInvitations1793000000000();
      await runner.query('DROP TABLE "portal_invitation"');
      await runner.query(
        'ALTER TABLE "user" DROP COLUMN "firstName", DROP COLUMN "lastName"',
      );
      await migration.up(runner);
      const legacyOfs = await database
        .getRepository(OfsEntity)
        .save(
          new OfsEntity('Legacy OFS', null, null, null, true, true, [], [], []),
        );
      await runner.query(
        `INSERT INTO "distributor_invitation" ("ofsId", "name", "email", "tokenHash", "expiresAt") VALUES ($1, 'Legacy distributor', 'legacy@example.test', 'legacy-hash', now() + interval '7 days')`,
        [legacyOfs.id],
      );
      await new SharePortalInvitations1795200000000().up(runner);
      const legacy = await database
        .getRepository(InvitationEntity)
        .findOneByOrFail({ email: 'legacy@example.test' });
      expect(legacy.role).toBe(UserRole.DISTRIBUTOR);
      expect(legacy.tokenHash).toBe('legacy-hash');
      await runner.release();
      process.env.OFS_PORTAL_URL = 'https://portal.example.test';
      process.env.DISTRIBUTOR_INVITATION_TEMPLATE_ID = '1';
      process.env.OFS_INVITATION_TEMPLATE_ID = '2';
      members = new OfsMembersService(
        database,
        new InvitationService(database, { sendEmail }),
        {
          hash: (password) => Promise.resolve(`hash:${password}`),
          compare: () => Promise.resolve(false),
        },
      );
      service = new DistributorInvitationService(
        database,
        new InvitationService(database, { sendEmail }),
        {
          hash: (password) => Promise.resolve(`hash:${password}`),
          compare: () => Promise.resolve(false),
        },
      );
    });
    afterAll(async () => {
      if (oldConfig.portal === undefined) delete process.env.OFS_PORTAL_URL;
      else process.env.OFS_PORTAL_URL = oldConfig.portal;
      if (oldConfig.template === undefined)
        delete process.env.DISTRIBUTOR_INVITATION_TEMPLATE_ID;
      else process.env.DISTRIBUTOR_INVITATION_TEMPLATE_ID = oldConfig.template;
      if (oldConfig.ofsTemplate === undefined)
        delete process.env.OFS_INVITATION_TEMPLATE_ID;
      else process.env.OFS_INVITATION_TEMPLATE_ID = oldConfig.ofsTemplate;
      if (database?.isInitialized) await database.destroy();
      if (admin?.isInitialized) {
        await admin.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
        await admin.destroy();
      }
    });
    beforeEach(async () => {
      await database.query('TRUNCATE ofs, distributor, "user" CASCADE');
      sendEmail.mockResolvedValue(undefined);
      ofs = await database
        .getRepository(OfsEntity)
        .save(new OfsEntity('OFS A', null, null, null, true, true, [], [], []));
    });
    const tokenFromMail = (index = 0) =>
      new URL(
        sendEmail.mock.calls[index][0][0].params.invitationUrl as string,
      ).searchParams.get('token')!;
    const invite = () =>
      service.invite(ofs, {
        name: 'Habitat Solidaire',
        email: 'PERSON@example.test',
      });

    it('persists only an invitation before acceptance and creates user, reseller and link atomically', async () => {
      await invite();
      expect(await database.getRepository(DistributorEntity).count()).toBe(0);
      expect(await database.getRepository(UserEntity).count()).toBe(0);
      const token = tokenFromMail();
      const row = await database
        .getRepository(InvitationEntity)
        .findOneByOrFail({ ofsId: ofs.id });
      expect(row.tokenHash).not.toContain(token);
      expect(row.email).toBe('person@example.test');
      await service.accept({ token, password: 'long-password-example' });
      const users = await database
        .getRepository(UserEntity)
        .find({ relations: ['distributor'] });
      expect(users).toHaveLength(1);
      expect(users[0].roles).toEqual([UserRole.DISTRIBUTOR]);
      expect(users[0].distributor!.name).toBe('Habitat Solidaire');
      expect(
        await database.query('SELECT * FROM ofs_distributor'),
      ).toHaveLength(1);
      expect(
        await database.query('SELECT * FROM commercial_transmission'),
      ).toHaveLength(0);
      await expect(
        service.accept({ token, password: 'long-password-example' }),
      ).rejects.toThrow('déjà acceptée');
    });

    it('rolls back an invitation when email delivery fails', async () => {
      sendEmail.mockRejectedValue(new Error('Email failed'));
      await expect(invite()).rejects.toThrow('Email failed');
      expect(await database.getRepository(InvitationEntity).count()).toBe(0);
    });

    it('invalidates old tokens on resend and cancel', async () => {
      await invite();
      const oldToken = tokenFromMail();
      const row = await database
        .getRepository(InvitationEntity)
        .findOneByOrFail({ ofsId: ofs.id });
      await service.manage(ofs, row.id, 'resend');
      await expect(service.inspect(oldToken)).rejects.toThrow('invalide');
      const newToken = tokenFromMail(1);
      expect((await service.inspect(newToken)).name).toBe(row.name);
      await service.manage(ofs, row.id, 'cancel');
      await expect(service.inspect(newToken)).rejects.toThrow('annulée');
    });

    it('creates one organization when two same-name invitations are accepted concurrently', async () => {
      await invite();
      await service.invite(ofs, {
        name: 'Habitat Solidaire',
        email: 'other@example.test',
      });
      const results = await Promise.allSettled(
        [0, 1].map((index) =>
          service.accept({
            token: tokenFromMail(index),
            password: 'long-password-example',
            createNew: true,
            reviewedMatchIds: [],
          }),
        ),
      );
      expect(
        results.filter((result) => result.status === 'fulfilled'),
      ).toHaveLength(1);
      expect(await database.getRepository(DistributorEntity).count()).toBe(1);
      expect(await database.getRepository(UserEntity).count()).toBe(1);
    });

    it('links an existing reseller by email without creating an invitation', async () => {
      const distributor = await database
        .getRepository(DistributorEntity)
        .save(new DistributorEntity('Existing reseller', '', []));
      await database
        .getRepository(UserEntity)
        .save(
          new UserEntity(
            'person@example.test',
            'hash',
            [UserRole.DISTRIBUTOR],
            true,
            [],
            distributor,
          ),
        );
      const result = await invite();
      expect(result.kind).toBe('linked');
      expect(result.message).toContain('Existing reseller');
      expect(await database.getRepository(InvitationEntity).count()).toBe(0);
      expect(sendEmail).not.toHaveBeenCalled();
    });
    const inviteMember = (email = 'colleague@example.test') =>
      members.invite(ofs, email);
    const acceptMember = (token: string) =>
      members.accept({
        token,
        firstName: 'Camille',
        lastName: 'Dupont',
        password: 'long-password-example',
      });

    it('grants OFS membership only after acceptance and exposes only directory fields', async () => {
      await inviteMember();
      expect(await members.members(ofs.id)).toEqual([]);
      const token = tokenFromMail();
      expect(await members.inspect(token)).toMatchObject({
        existingAccount: false,
        ofsName: ofs.name,
      });
      await acceptMember(token);
      const team = await members.members(ofs.id);
      expect(team).toHaveLength(1);
      expect(team[0]).toMatchObject({
        firstName: 'Camille',
        lastName: 'Dupont',
        email: 'colleague@example.test',
      });
      expect(Object.keys(team[0]).sort()).toEqual([
        'email',
        'firstName',
        'id',
        'lastName',
      ]);
      const account = await database
        .getRepository(UserEntity)
        .findOneByOrFail({ email: 'colleague@example.test' });
      expect(account.roles).toEqual([UserRole.OFS]);
      await expect(acceptMember(token)).rejects.toThrow('déjà acceptée');
    });

    it('adds an existing OFS account only after consent and preserves password and memberships', async () => {
      const otherOfs = await database
        .getRepository(OfsEntity)
        .save(
          new OfsEntity('Other OFS', null, null, null, true, true, [], [], []),
        );
      const user = await database
        .getRepository(UserEntity)
        .save(
          new UserEntity(
            'colleague@example.test',
            'original-hash',
            [UserRole.OFS],
            true,
            [otherOfs],
          ),
        );
      await inviteMember();
      expect(await members.members(ofs.id)).toHaveLength(0);
      expect((await members.inspect(tokenFromMail())).existingAccount).toBe(
        true,
      );
      await members.accept({
        token: tokenFromMail(),
        password: 'must-not-overwrite',
      });
      const updated = await database
        .getRepository(UserEntity)
        .findOneOrFail({ where: { id: user.id }, relations: ['ofss'] });
      expect(updated.password).toBe('original-hash');
      expect(updated.ofss.map((item) => item.id).sort()).toEqual(
        [ofs.id, otherOfs.id].sort(),
      );
    });

    it('separates lists and tokens by invitation role and prevents cross-role management', async () => {
      await invite();
      await inviteMember();
      const distributorToken = tokenFromMail(0);
      const memberToken = tokenFromMail(1);
      await expect(members.inspect(distributorToken)).rejects.toThrow(
        'invalide',
      );
      await expect(acceptMember(distributorToken)).rejects.toThrow('invalide');
      await expect(service.inspect(memberToken)).rejects.toThrow('invalide');
      await expect(service.accept({ token: memberToken })).rejects.toThrow(
        'invalide',
      );
      expect(await service.list(ofs.id)).toHaveLength(1);
      const common = new InvitationService(database, { sendEmail });
      const memberInvitations = await common.list(ofs.id, UserRole.OFS);
      expect(memberInvitations).toHaveLength(1);
      await expect(
        service.manage(ofs, memberInvitations[0].id, 'cancel'),
      ).rejects.toThrow();
      await expect(
        members.manage(ofs, (await service.list(ofs.id))[0].id, 'cancel'),
      ).rejects.toThrow();
    });

    it('resends expired OFS invitations, invalidates old links and cancels new links', async () => {
      await inviteMember();
      const oldToken = tokenFromMail();
      const repo = database.getRepository(InvitationEntity);
      const row = await repo.findOneByOrFail({
        ofsId: ofs.id,
        role: UserRole.OFS,
      });
      await repo.update(row.id, { expiresAt: new Date(0) });
      await expect(acceptMember(oldToken)).rejects.toThrow('expirée');
      await members.manage(ofs, row.id, 'resend');
      await expect(members.inspect(oldToken)).rejects.toThrow('invalide');
      expect(await members.inspect(tokenFromMail(1))).toMatchObject({
        email: row.email,
      });
      await members.manage(ofs, row.id, 'cancel');
      await expect(acceptMember(tokenFromMail(1))).rejects.toThrow('annulée');
      await expect(members.manage(ofs, row.id, 'resend')).rejects.toThrow();
    });

    it.each([UserRole.ADMIN, UserRole.DISTRIBUTOR])(
      'rejects inviting or accepting a %s account',
      async (role) => {
        await inviteMember();
        await database
          .getRepository(UserEntity)
          .save(
            new UserEntity('colleague@example.test', 'hash', [role], true, []),
          );
        await expect(inviteMember()).rejects.toThrow(ConflictException);
        await expect(acceptMember(tokenFromMail())).rejects.toThrow(
          ConflictException,
        );
      },
    );

    it('accepts new accounts without names and allows adding and clearing names later', async () => {
      await inviteMember();
      await members.accept({
        token: tokenFromMail(),
        password: 'long-password-example',
      });
      let [member] = await members.members(ofs.id);
      expect(member).toMatchObject({ firstName: null, lastName: null });
      await members.updateName(member.id, 'Camille');
      [member] = await members.members(ofs.id);
      expect(member).toMatchObject({ firstName: 'Camille', lastName: null });
      await members.updateName(member.id, '', '   ');
      [member] = await members.members(ofs.id);
      expect(member).toMatchObject({ firstName: null, lastName: null });
    });

    it('rejects disabled accounts even when names are omitted', async () => {
      await inviteMember();
      await database
        .getRepository(UserEntity)
        .save(
          new UserEntity(
            'colleague@example.test',
            'hash',
            [UserRole.OFS],
            false,
            [],
          ),
        );
      await expect(acceptMember(tokenFromMail())).rejects.toThrow('désactivé');
      expect(await members.members(ofs.id)).toHaveLength(0);
    });

    it('deduplicates concurrent OFS invites and atomically accepts concurrent invites for one email', async () => {
      await Promise.all([inviteMember(), inviteMember()]);
      expect(await database.getRepository(InvitationEntity).count()).toBe(1);
      const otherOfs = await database
        .getRepository(OfsEntity)
        .save(
          new OfsEntity('Other OFS', null, null, null, true, true, [], [], []),
        );
      await members.invite(otherOfs, 'colleague@example.test');
      await Promise.all([
        acceptMember(tokenFromMail(0)),
        acceptMember(tokenFromMail(1)),
      ]);
      expect(await database.getRepository(UserEntity).count()).toBe(1);
      expect(await members.members(ofs.id)).toHaveLength(1);
      expect(await members.members(otherOfs.id)).toHaveLength(1);
    });

    it('rolls back failed OFS invitation delivery and does not create duplicate members', async () => {
      sendEmail.mockRejectedValueOnce(new Error('Email failed'));
      await expect(inviteMember()).rejects.toThrow('Email failed');
      expect(await database.getRepository(InvitationEntity).count()).toBe(0);
      await inviteMember();
      await acceptMember(tokenFromMail(1));
      expect((await inviteMember()).message).toContain('déjà partie');
      expect(await members.members(ofs.id)).toHaveLength(1);
    });
    it('enforces OFS authorization and validates team and identity requests over HTTP', async () => {
      const account = await database
        .getRepository(UserEntity)
        .save(
          new UserEntity('member@example.test', 'hash', [UserRole.OFS], true, [
            ofs,
          ]),
        );
      let actor = account;
      let authenticated = true;
      const module = await Test.createTestingModule({
        controllers: [OfsMembersController, AccountNameController],
        providers: [
          { provide: OfsMembersService, useValue: members },
          {
            provide: InvitationService,
            useValue: new InvitationService(database, { sendEmail }),
          },
          { provide: AuthRateLimitService, useValue: { consume: jest.fn() } },
        ],
      }).compile();
      const app = module.createNestApplication();
      app.use((req: Request, _res: Response, next: NextFunction) => {
        Object.assign(req, {
          isAuthenticated: () => authenticated,
          user: actor,
        });
        next();
      });
      app.useGlobalPipes(createValidationPipe());
      await app.listen(0, '127.0.0.1');
      try {
        const http = () => request(app.getHttpServer() as Server);
        const base = `/api/portal/ofss/${ofs.id}/members`;
        await http().get(base).expect(200);
        await http()
          .post(`${base}/invitations`)
          .send({ email: 'not-an-email' })
          .expect(400);
        await http()
          .post(`${base}/invitations`)
          .send({ email: 'new@example.test', role: 'admin' })
          .expect(400);
        await http()
          .post('/api/portal/account-name')
          .send({ firstName: '  Camille  ', lastName: ' Dupont ' })
          .expect(201);
        const updated = await database
          .getRepository(UserEntity)
          .findOneByOrFail({ id: account.id });
        expect(updated.firstName).toBe('Camille');
        await http()
          .post('/api/portal/account-name')
          .send({ firstName: 'X', lastName: 'Y', userId: randomUUID() })
          .expect(400);
        actor = new UserEntity(
          'other@example.test',
          'hash',
          [UserRole.OFS],
          true,
          [],
        );
        await http().get(base).expect(404);
        await http()
          .post(`${base}/invitations`)
          .send({ email: 'new@example.test' })
          .expect(404);
        await http()
          .post(`${base}/invitations/${randomUUID()}/resend`)
          .send({})
          .expect(404);
        await http()
          .post(`${base}/invitations/${randomUUID()}/cancel`)
          .send({})
          .expect(404);
        actor = new UserEntity(
          'reseller@example.test',
          'hash',
          [UserRole.DISTRIBUTOR],
          true,
          [ofs],
        );
        await http().get(base).expect(404);
        actor = account;
        authenticated = false;
        await http().get(base).expect(401);
        await http()
          .post(`${base}/invitations`)
          .send({ email: 'new@example.test' })
          .expect(401);
      } finally {
        await app.close();
      }
    });
  },
);
