import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { FindOneByEmailUsecase } from 'src/application/user/usecases/findOneByEmail.usecase';
import { PasswordHasher } from './password/password-hasher';
import { SaveUserUseCase } from 'src/application/user/usecases/save.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [],
  providers: [
    { provide: 'UserRepositoryInterface', useClass: UserRepository },
    { provide: 'PasswordHasherInterface', useClass: PasswordHasher },
    FindOneByEmailUsecase,
    SaveUserUseCase,
  ],
  exports: [
    'UserRepositoryInterface',
    'PasswordHasherInterface',
    FindOneByEmailUsecase,
    SaveUserUseCase,
  ],
})
export class UserModule {}
