import { Inject, Injectable } from '@nestjs/common';
import { Pagination } from 'src/application/common/pagination';
import {
  FindAllUsersFilters,
  UserRepositoryInterface,
} from 'src/domain/user/user.repository.interface';
import { PaginationProps } from 'src/domain/common/paginationProps';
import { AdminUserListItemView } from '../views/admin-user-list-item.view';

@Injectable()
export class FindAllUsersUsecase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async execute(
    paginationProps: PaginationProps,
    filters?: FindAllUsersFilters,
  ): Promise<Pagination<AdminUserListItemView>> {
    const [users, totalCount] = await this.userRepository.findAll(
      paginationProps,
      filters,
    );

    return new Pagination(
      users.map(
        (user) =>
          new AdminUserListItemView(
            user.id,
            user.email,
            user.roles,
            user.isActive,
            user.ofss
              .map((ofs) => ({ id: ofs.id, name: ofs.name }))
              .sort((left, right) => left.name.localeCompare(right.name, 'fr')),
            user.lastLoginAt || null,
          ),
      ),
      totalCount,
      paginationProps,
    );
  }
}
