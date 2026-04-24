import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { AdminUserDetailView } from '../views/admin-user-detail.view';

@Injectable()
export class FindUserByIdUsecase {
  constructor(
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  public async execute(id: string): Promise<AdminUserDetailView> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException();
    }

    return new AdminUserDetailView(
      user.id,
      user.email,
      user.roles,
      user.isActive,
      user.ofss
        .map((ofs) => ({ id: ofs.id, name: ofs.name }))
        .sort((left, right) => left.name.localeCompare(right.name, 'fr')),
      user.lastLoginAt || null,
      user.createdAt,
      user.updatedAt,
    );
  }
}
