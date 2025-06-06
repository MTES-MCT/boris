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

  public async save(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }

  public async findOneByEmail(email: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { email } });
  }
}
