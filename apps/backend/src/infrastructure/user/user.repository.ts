import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  FindAllUsersFilters,
  UserRepositoryInterface,
} from 'src/domain/user/user.repository.interface';
import { UserEntity } from './user.entity';
import { PaginationProps } from 'src/domain/common/paginationProps';
import { UserRole } from 'src/domain/user/user-role.enum';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  public async save(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }

  public async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { email },
      relations: ['ofss'],
    });
  }

  public async findById(id: string): Promise<UserEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['ofss'],
    });
  }

  public async findAll(
    paginationProps: PaginationProps,
    filters?: FindAllUsersFilters,
  ): Promise<[UserEntity[], number]> {
    const { pageSize, page } = paginationProps;

    const query = this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.ofss', 'ofss');

    if (filters?.role) {
      query.andWhere(':role = ANY(user.roles)', { role: filters.role });
    }

    if (typeof filters?.isActive === 'boolean') {
      query.andWhere('user.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    if (filters?.ofsId) {
      query.andWhere('ofss.id = :ofsId', { ofsId: filters.ofsId });
      query.andWhere(':ofsRole = ANY(user.roles)', { ofsRole: UserRole.OFS });
    }

    if (filters?.search) {
      query.andWhere('LOWER(user.email) LIKE :search', {
        search: `%${filters.search.toLowerCase()}%`,
      });
    }

    query.skip((page - 1) * pageSize);
    query.take(pageSize);
    query.orderBy('user.email', 'ASC');

    return query.getManyAndCount();
  }

  public async countActiveAdmins(): Promise<number> {
    return this.repository
      .createQueryBuilder('user')
      .where('user.isActive = true')
      .andWhere(':role = ANY(user.roles)', { role: UserRole.ADMIN })
      .getCount();
  }
}
