import { UserEntity } from 'src/infrastructure/user/user.entity';

export interface UserRepositoryInterface {
  findOneByEmail(email: string): UserEntity | null;
}
