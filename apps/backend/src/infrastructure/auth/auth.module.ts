import { Module } from '@nestjs/common';
import { AdminLoginController } from './controllers/login.controller';
import { UserModule } from 'src/infrastructure/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { LoginUsecase } from 'src/application/auth/usecases/login.usecase';
import { UserSerializer } from 'src/infrastructure/auth/serializers/user.serializer';
import { AdminLogoutController } from './controllers/logout.controller';

@Module({
  imports: [PassportModule.register({ session: true }), UserModule],
  controllers: [AdminLoginController, AdminLogoutController],
  providers: [LocalStrategy, LoginUsecase, UserSerializer],
  exports: [],
})
export class AuthModule {}
