import { ExecutionContext } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Repository } from 'typeorm';
import { Pagination } from 'src/application/common/pagination';
import { UserRole } from 'src/domain/user/user-role.enum';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { UsersFiltersDTO } from 'src/infrastructure/user/dtos/admin/users-filters.dto';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { UserRepository } from 'src/infrastructure/user/user.repository';
import { UsersPageBuilder } from 'src/infrastructure/user/users-page.builder';

describe('Admin users list last login sorting', () => {
  const filters = {
    page: 2,
    pageSize: 10,
    search: 'example',
    role: UserRole.OFS,
    sort: 'lastLoginAtDesc' as const,
  };

  it.each(['lastLoginAtDesc', 'lastLoginAtAsc'] as const)(
    'sorts %s across the paginated query, with missing logins last',
    async (sort) => {
      const query = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        addOrderBy: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      };
      const repository = new UserRepository({
        createQueryBuilder: () => query,
      } as unknown as Repository<UserEntity>);

      await repository.findAll(filters, { ...filters, sort });

      expect(query.orderBy).toHaveBeenCalledWith(
        'user.lastLoginAt',
        sort === 'lastLoginAtAsc' ? 'ASC' : 'DESC',
        'NULLS LAST',
      );
      expect(query.addOrderBy.mock.calls).toEqual([
        ['user.email', 'ASC'],
        ['user.id', 'ASC'],
      ]);
      expect(query.skip).toHaveBeenCalledWith(10);
      expect(query.take).toHaveBeenCalledWith(10);
      expect(query.andWhere).toHaveBeenCalledWith(
        'LOWER(user.email) LIKE :search',
        { search: '%example%' },
      );
    },
  );

  it('preserves sorting in pagination, filter removal, and edit return links', () => {
    const pagination = new Pagination([], 30, filters);
    const view = UsersPageBuilder.buildListView([], pagination, filters);
    const current = UsersPageBuilder.currentListHref(filters);
    const editHref = UsersPageBuilder.editPagePath('user-id', current);

    expect(new URLSearchParams(current.split('?')[1]).get('sort')).toBe(
      filters.sort,
    );
    expect(decodeURIComponent(editHref.split('returnTo=')[1])).toBe(current);
    for (const link of view.paginationLinks.filter((link) => link.href)) {
      expect(new URLSearchParams(link.href!.split('?')[1]).get('sort')).toBe(
        filters.sort,
      );
    }
    const removedRole = new URLSearchParams(
      view.structuredFilterChips[0].removeHref.split('?')[1],
    );
    expect(removedRole.get('sort')).toBe(filters.sort);
    expect(removedRole.has('page')).toBe(false);
    expect(removedRole.has('role')).toBe(false);
  });

  it('rejects unsupported sort values', async () => {
    const invalid = plainToInstance(UsersFiltersDTO, { sort: 'password' });
    expect((await validate(invalid)).map((error) => error.property)).toContain(
      'sort',
    );
    const valid = plainToInstance(UsersFiltersDTO, { sort: filters.sort });
    expect(await validate(valid)).toEqual([]);
  });

  it.each([
    [UserRole.ADMIN, true, true, true],
    [UserRole.OFS, true, true, false],
    [UserRole.DISTRIBUTOR, true, true, false],
    [UserRole.ADMIN, false, true, false],
    [UserRole.ADMIN, true, false, false],
  ])(
    'enforces admin access for role %s, active %s, authenticated %s',
    (role, isActive, authenticated, allowed) => {
      const context = {
        switchToHttp: () => ({
          getRequest: () => ({
            isAuthenticated: () => authenticated,
            user: { isActive, roles: [role] },
          }),
        }),
      } as ExecutionContext;
      expect(new LocalIsAuthenticatedGuard().canActivate(context)).toBe(
        allowed,
      );
    },
  );
});
