import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { DistributorInvitationService } from 'src/infrastructure/distributor-invitation/distributor-invitation.service';
import { DistributorInvitationEntity } from 'src/infrastructure/distributor-invitation/distributor-invitation.entity';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { UserRole } from 'src/domain/user/user-role.enum';
import { matchDistributors } from 'src/infrastructure/distributor-invitation/distributor-name-matching';

describe('Commercialisateur invitations', () => {
  const ofsId = 'ofs-a';
  const token = 'a'.repeat(43);
  let invitation: DistributorInvitationEntity;
  let user: UserEntity | null;
  let distributors: DistributorEntity[];
  let service: DistributorInvitationService;
  let manager: EntityManager;
  const query = jest.fn();
  const save = jest.fn();
  const sendEmail = jest.fn();
  const hash = jest.fn();

  beforeEach(() => {
    invitation = Object.assign(new DistributorInvitationEntity(), {
      id: 'invite-a',
      ofsId,
      name: 'Habitat Solidaire',
      email: 'person@example.test',
      status: 'pending',
      expiresAt: new Date(Date.now() + 10000),
    });
    user = null;
    distributors = [];
    query.mockResolvedValue([]);
    sendEmail.mockResolvedValue(undefined);
    hash.mockResolvedValue('hash');
    save.mockImplementation((entity) =>
      Promise.resolve(Object.assign(entity, { id: entity.id || 'new-id' })),
    );
    manager = {
      query,
      save,
      find: jest.fn(() => Promise.resolve(distributors)),
      findOne: jest.fn((entity) =>
        Promise.resolve(
          entity === DistributorInvitationEntity ? invitation : user,
        ),
      ),
      findOneBy: jest.fn((entity) =>
        Promise.resolve(
          entity === DistributorInvitationEntity ? invitation : null,
        ),
      ),
      findOneByOrFail: jest.fn(() => Promise.resolve(distributors[0])),
    } as unknown as EntityManager;
    const source = {
      manager,
      transaction: (callback: (m: EntityManager) => unknown) =>
        callback(manager),
      getRepository: jest.fn(() => ({
        findOneBy: jest.fn(() => Promise.resolve({ id: ofsId, name: 'OFS A' })),
      })),
    } as unknown as DataSource;
    service = new DistributorInvitationService(
      source,
      { sendEmail },
      { hash, compare: jest.fn() },
    );
  });

  it('creates exactly one reseller-only account and an OFS link, without a transmission', async () => {
    const result = await service.accept({
      token,
      password: 'long-password-example',
    });
    expect(result.accountCreated).toBe(true);
    const entities = save.mock.calls.map(([entity]) => entity);
    expect(
      entities.filter((entity) => entity instanceof DistributorEntity),
    ).toHaveLength(1);
    const createdUser = entities.find((entity) => entity instanceof UserEntity);
    expect(createdUser!.roles).toEqual([UserRole.DISTRIBUTOR]);
    expect(createdUser!.distributor).toBe(
      entities.find((entity) => entity instanceof DistributorEntity),
    );
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO "ofs_distributor"'),
      [ofsId, 'new-id'],
    );
    expect(entities).toHaveLength(3);
    expect(invitation.status).toBe('accepted');
  });

  it('uses the organization of an email that acquired a reseller account while pending', async () => {
    const distributor = Object.assign(
      new DistributorEntity('Already here', '', []),
      { id: 'existing' },
    );
    user = new UserEntity(
      invitation.email,
      'existing-password',
      [UserRole.DISTRIBUTOR],
      true,
      [],
      distributor,
    );
    const result = await service.accept({
      token,
      password: 'do-not-change-this',
    });
    expect(result.distributor.name).toBe('Already here');
    expect(result.accountCreated).toBe(false);
    expect(save).toHaveBeenCalledTimes(1);
    expect(hash).not.toHaveBeenCalled();
    expect(user.password).toBe('existing-password');
  });

  it.each([UserRole.OFS, UserRole.ADMIN])(
    'rejects an email that acquired a %s account while pending',
    async (role) => {
      user = new UserEntity(invitation.email, 'existing-password', [role]);
      await expect(
        service.accept({ token, password: 'long-password-example' }),
      ).rejects.toThrow(ConflictException);
      expect(save).not.toHaveBeenCalled();
      expect(invitation.status).toBe('pending');
    },
  );

  it.each([UserRole.OFS, UserRole.ADMIN])(
    'rejects sending to an existing %s email with an explanation',
    async (role) => {
      user = new UserEntity(invitation.email, 'hash', [role]);
      await expect(
        service.invite({ id: ofsId, name: 'OFS A' } as OfsEntity, {
          name: invitation.name,
          email: invitation.email,
        }),
      ).rejects.toThrow('Utilisez une autre adresse');
      expect(sendEmail).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
    },
  );

  it('immediately links the actual reseller associated with the invited email', async () => {
    const distributor = Object.assign(
      new DistributorEntity('Actual organization', '', []),
      { id: 'actual' },
    );
    user = new UserEntity(
      invitation.email,
      'hash',
      [UserRole.DISTRIBUTOR],
      true,
      [],
      distributor,
    );
    const result = await service.invite(
      { id: ofsId, name: 'OFS A' } as OfsEntity,
      {
        name: 'Proposed different name',
        email: invitation.email,
      },
    );
    expect(result.kind).toBe('linked');
    expect(result.message).toContain('Actual organization');
    expect(sendEmail).not.toHaveBeenCalled();
    expect(save).not.toHaveBeenCalled();
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO "ofs_distributor"'),
      [ofsId, 'actual'],
    );
  });

  it.each(['expired', 'cancelled', 'accepted'])(
    'rejects an %s invitation',
    async (state) => {
      if (state === 'expired') invitation.expiresAt = new Date(0);
      else invitation.status = state as 'cancelled' | 'accepted';
      await expect(
        service.accept({ token, password: 'long-password-example' }),
      ).rejects.toThrow(BadRequestException);
      expect(save).not.toHaveBeenCalled();
    },
  );

  it('requires reviewing a newly created matching organization even if createNew is set', async () => {
    distributors = [
      Object.assign(new DistributorEntity('Habitat Solidaire', '', []), {
        id: 'existing',
      }),
    ];
    await expect(
      service.accept({
        token,
        password: 'long-password-example',
        createNew: true,
        reviewedMatchIds: [],
      }),
    ).rejects.toThrow(ConflictException);
    expect(save).not.toHaveBeenCalled();
  });

  it('links a selected suggestion without granting organization membership', async () => {
    distributors = [
      Object.assign(new DistributorEntity('Habitat Solidaire', '', []), {
        id: 'existing',
      }),
    ];
    const result = await service.accept({ token, distributorId: 'existing' });
    expect(result.accountCreated).toBe(false);
    expect(save).toHaveBeenCalledTimes(1);
    expect(hash).not.toHaveBeenCalled();
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('INSERT INTO "ofs_distributor"'),
      [ofsId, 'existing'],
    );
  });

  it('does not accept an arbitrary organization id', async () => {
    await expect(
      service.accept({ token, distributorId: 'other' }),
    ).rejects.toThrow(BadRequestException);
    expect(save).not.toHaveBeenCalled();
  });

  it('rejects resellers and OFS users without attachment from invitation management', async () => {
    await expect(
      service.accessibleOfs(
        ofsId,
        new UserEntity('a', 'b', [UserRole.DISTRIBUTOR], true, []),
      ),
    ).rejects.toThrow(NotFoundException);
    await expect(
      service.accessibleOfs(
        ofsId,
        new UserEntity('a', 'b', [UserRole.OFS], true, []),
      ),
    ).rejects.toThrow(NotFoundException);
  });

  it('matches accents, punctuation, case and spelling mistakes', () => {
    const items = [
      { id: '1', name: 'HABITAT Solidaire' },
      { id: '2', name: 'Équité Logement' },
      { id: '3', name: 'Unrelated' },
    ];
    expect(
      matchDistributors('habitat solidare', items).map((item) => item.id),
    ).toEqual(['1']);
    expect(
      matchDistributors('equite-logement', items).map((item) => item.id),
    ).toEqual(['2']);
    expect(matchDistributors('', items)).toEqual([]);
  });
});
