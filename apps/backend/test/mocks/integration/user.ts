import { UserEntity } from 'src/infrastructure/user/user.entity';

export const user1 = new UserEntity('user1@example.com', 'password');
export const user2 = new UserEntity('user2@example.com', 'password');

export const mockUserRepository = {
  findOneByEmail: jest.fn(),
  save: jest.fn(),
};

export const mockPasswordHasher = {
  hash: jest.fn(),
  compare: jest.fn(),
};
