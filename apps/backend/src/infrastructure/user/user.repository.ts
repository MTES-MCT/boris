import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  public findOneByEmail(email: string): UserEntity | null {
    const mockedUsers: UserEntity[] = [
      new UserEntity('test@test.com', 'test'),
      new UserEntity('test2@test.com', 'test2'),
    ];

    return mockedUsers.find((user) => user.email === email) || null;
  }
}
