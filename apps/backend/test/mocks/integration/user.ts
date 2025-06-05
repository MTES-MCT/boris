import { UserEntity } from 'src/infrastructure/user/user.entity';

export const user1 = new UserEntity('user1@example.com', 'hashedpassword1');
export const user2 = new UserEntity('user2@example.com', 'hashedpassword2');

export const mockUserRepository = {
  findOneByEmail: jest.fn(),
};
