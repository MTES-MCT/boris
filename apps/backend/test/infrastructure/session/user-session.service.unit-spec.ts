import { Repository } from 'typeorm';
import { SessionEntity } from 'src/infrastructure/session/session.entity';
import { UserSessionService } from 'src/infrastructure/session/user-session.service';

describe('UserSessionService', () => {
  it('revokes authenticated sessions and pending password-verified logins together', async () => {
    const query = {
      where: jest.fn().mockReturnThis(),
      getMany: jest
        .fn()
        .mockResolvedValue([{ id: 'authenticated' }, { id: 'pending' }]),
    };
    const repository = {
      createQueryBuilder: () => query,
      delete: jest.fn().mockResolvedValue({}),
    };
    const service = new UserSessionService(
      repository as unknown as Repository<SessionEntity>,
    );
    await service.destroyAllForUserId('admin-id');
    const [sql, params] = query.where.mock.calls[0];
    expect(sql).toContain("'{passport,user}'");
    expect(sql).toContain("'{pendingTwoFactor,userId}'");
    expect(params).toEqual({ userId: 'admin-id' });
    expect(repository.delete).toHaveBeenCalledWith([
      'authenticated',
      'pending',
    ]);
  });
});
