import { UserEntity } from 'src/infrastructure/user/user.entity';

export interface UserRepositoryInterface {
  save(user: UserEntity): Promise<UserEntity>;
  findOneByEmail(email: string): Promise<UserEntity | null>;
}
