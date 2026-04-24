import { UserEntity } from 'src/infrastructure/user/user.entity';
import { PaginationProps } from '../common/paginationProps';
import { UserRole } from './user-role.enum';

export type FindAllUsersFilters = {
  role?: UserRole;
  isActive?: boolean;
  ofsId?: string;
  search?: string;
};

export interface UserRepositoryInterface {
  save(user: UserEntity): Promise<UserEntity>;
  findOneByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
  findAll(
    paginationProps: PaginationProps,
    filters?: FindAllUsersFilters,
  ): Promise<[UserEntity[], number]>;
  countActiveAdmins(): Promise<number>;
}
