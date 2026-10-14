import { randomUUID } from 'crypto';
import { DataSource } from 'typeorm';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { DistributorInvitationService } from 'src/infrastructure/distributor-invitation/distributor-invitation.service';
import { DistributorInvitationEntity } from 'src/infrastructure/distributor-invitation/distributor-invitation.entity';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { UserRole } from 'src/domain/user/user-role.enum';
import { CreateDistributorInvitations1793000000000 } from 'src/infrastructure/persistence/migrations/1793000000000-create_distributor_invitations';

const databaseUrl = process.env.DISTRIBUTOR_INVITATION_TEST_DATABASE_URL;
const describeDatabase = databaseUrl ? describe : describe.skip;

describeDatabase(
  'Reseller invitation transactions (PostgreSQL, isolated schema)',
  () => {
    const schema = `invitation_test_${randomUUID().replace(/-/g, '')}`;
    let admin: DataSource;
    let database: DataSource;
    let service: DistributorInvitationService;
    let ofs: OfsEntity;
    const sendEmail = jest.fn();
    const oldConfig = {
      portal: process.env.OFS_PORTAL_URL,
      template: process.env.DISTRIBUTOR_INVITATION_TEMPLATE_ID,
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
      await migration.down(runner);
      await migration.up(runner);
      await runner.release();
      process.env.OFS_PORTAL_URL = 'https://portal.example.test';
      process.env.DISTRIBUTOR_INVITATION_TEMPLATE_ID = '1';
      service = new DistributorInvitationService(
        database,
        { sendEmail },
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
        .getRepository(DistributorInvitationEntity)
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
      expect(
        await database.getRepository(DistributorInvitationEntity).count(),
      ).toBe(0);
    });

    it('invalidates old tokens on resend and cancel', async () => {
      await invite();
      const oldToken = tokenFromMail();
      const row = await database
        .getRepository(DistributorInvitationEntity)
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
      expect(
        await database.getRepository(DistributorInvitationEntity).count(),
      ).toBe(0);
      expect(sendEmail).not.toHaveBeenCalled();
    });
  },
);
