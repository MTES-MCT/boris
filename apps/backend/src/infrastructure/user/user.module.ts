import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { FindOneByEmailUsecase } from 'src/application/user/usecases/findOneByEmail.usecase';
import { PasswordHasher } from './password/password-hasher';
import { SaveUserUseCase } from 'src/application/user/usecases/save.usecase';
import { SessionModule } from '../session/session.module';
import { OfsEntity } from '../ofs/ofs.entity';
import { UserPasswordResetTokenEntity } from './user-password-reset-token.entity';
import { FindAllUsersUsecase } from 'src/application/user/usecases/findAll.usecase';
import { FindUserByIdUsecase } from 'src/application/user/usecases/findById.usecase';
import { CreateManagedUserUsecase } from 'src/application/user/usecases/create-managed-user.usecase';
import { UpdateManagedUserUsecase } from 'src/application/user/usecases/update-managed-user.usecase';
import { ResetUserPasswordUsecase } from 'src/application/user/usecases/reset-password.usecase';
import { SetUserActiveStatusUsecase } from 'src/application/user/usecases/set-active-status.usecase';
import { GetUsersAdminController } from './controllers/admin/get-users.controller';
import { CreateUserAdminController } from './controllers/admin/create-user.controller';
import { UpdateUserAdminController } from './controllers/admin/update-user.controller';
import { MailerModule } from '../mailer/mailer.module';
import { RequestPasswordResetUsecase } from 'src/application/user/usecases/request-password-reset.usecase';
import { ResetPasswordWithTokenUsecase } from 'src/application/user/usecases/reset-password-with-token.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      OfsEntity,
      UserPasswordResetTokenEntity,
    ]),
    SessionModule,
    MailerModule,
  ],
  controllers: [
    GetUsersAdminController,
    CreateUserAdminController,
    UpdateUserAdminController,
  ],
  providers: [
    { provide: 'UserRepositoryInterface', useClass: UserRepository },
    { provide: 'PasswordHasherInterface', useClass: PasswordHasher },
    FindOneByEmailUsecase,
    SaveUserUseCase,
    FindAllUsersUsecase,
    FindUserByIdUsecase,
    CreateManagedUserUsecase,
    UpdateManagedUserUsecase,
    ResetUserPasswordUsecase,
    SetUserActiveStatusUsecase,
    RequestPasswordResetUsecase,
    ResetPasswordWithTokenUsecase,
  ],
  exports: [
    'UserRepositoryInterface',
    'PasswordHasherInterface',
    FindOneByEmailUsecase,
    SaveUserUseCase,
    FindAllUsersUsecase,
    FindUserByIdUsecase,
    RequestPasswordResetUsecase,
    ResetPasswordWithTokenUsecase,
  ],
})
export class UserModule {}
