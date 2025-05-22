import { Module } from '@nestjs/common';
import { LoginUsecase } from 'src/application/auth/login.usecase';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local/local.strategy';
import { UserSerializer } from './serializers/user.serializer';
import { LocalLoginController } from './local/controllers/login.controller';
import { LocalLogoutController } from './local/controllers/logout.controller';

@Module({
  imports: [PassportModule.register({ session: true }), UserModule],
  controllers: [LocalLoginController, LocalLogoutController],
  providers: [LocalStrategy, LoginUsecase, UserSerializer],
  exports: [],
})
export class AuthModule {}
