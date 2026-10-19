import { NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { DataSource, SelectQueryBuilder } from 'typeorm';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { DistributorInvitationService } from 'src/infrastructure/distributor-invitation/distributor-invitation.service';
import { PortalDistributorInvitationsController } from 'src/infrastructure/distributor-invitation/distributor-invitation.controller';
import { AuthRateLimitService } from 'src/infrastructure/auth/auth-rate-limit.service';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { UserRole } from 'src/domain/user/user-role.enum';

describe('Linked commercialisateur account emails', () => {
  let source: DataSource;
  let service: DistributorInvitationService;

  beforeEach(async () => {
    source = new DataSource(typeormConfig);
    // Build real query metadata without connecting to a database.
    await (
      source as unknown as { buildMetadatas(): Promise<void> }
    ).buildMetadatas();
    service = new DistributorInvitationService(
      source,
      { sendEmail: jest.fn() },
      { hash: jest.fn(), compare: jest.fn() },
    );
  });

  afterEach(() => jest.restoreAllMocks());

  it('scopes the query to linked distributors and selects only active reseller account emails', async () => {
    let sql = '';
    let parameters: unknown[] = [];
    jest
      .spyOn(SelectQueryBuilder.prototype, 'getRawMany')
      .mockImplementation(function () {
        [sql, parameters] = this.getQueryAndParameters();
        return Promise.resolve([
          { id: 'one', name: 'Habitat', email: 'alice@example.test' },
          { id: 'one', name: 'Habitat', email: 'bob@example.test' },
          { id: 'empty', name: 'Sans compte', email: null },
        ]);
      });

    await expect(service.linkedDistributors('ofs-a')).resolves.toEqual([
      {
        id: 'one',
        name: 'Habitat',
        emails: ['alice@example.test', 'bob@example.test'],
      },
      { id: 'empty', name: 'Sans compte', emails: [] },
    ]);
    expect(sql).toContain('INNER JOIN "ofs" "ofs"');
    expect(sql).toContain('"ofs"."id" = $1');
    expect(sql).toContain('LEFT JOIN "user" "account"');
    expect(sql).toContain('"account"."distributorId" = "distributor"."id"');
    expect(sql).toContain('"account"."isActive" = $2');
    expect(sql).toContain('$3 = ANY("account"."roles")');
    expect(parameters).toEqual(['ofs-a', true, UserRole.DISTRIBUTOR]);
    expect(sql.split(' FROM ')[0]).toBe(
      'SELECT "distributor"."id" AS "id", "distributor"."name" AS "name", "account"."email" AS "email"',
    );
  });

  it('does not query emails if the requester cannot access the OFS', async () => {
    const list = jest.spyOn(service, 'linkedDistributors');
    const controller = new PortalDistributorInvitationsController(
      service,
      {} as AuthRateLimitService,
    );
    const user = new UserEntity(
      'other@example.test',
      '',
      [UserRole.OFS],
      true,
      [],
    );
    await expect(
      controller.linkedDistributors('ofs-a', { user } as unknown as Request),
    ).rejects.toThrow(NotFoundException);
    expect(list).not.toHaveBeenCalled();
  });
});
