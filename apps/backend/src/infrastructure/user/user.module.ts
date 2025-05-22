import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { FindOneByEmailUsecase } from 'src/application/user/usecases/findOneByEmail.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [],
  providers: [
    { provide: 'UserRepositoryInterface', useClass: UserRepository },
    FindOneByEmailUsecase,
  ],
  exports: ['UserRepositoryInterface', FindOneByEmailUsecase],
})
export class UserModule {}
