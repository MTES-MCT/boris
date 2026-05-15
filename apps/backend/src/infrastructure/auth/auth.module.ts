import { Module } from '@nestjs/common';
import { AdminLoginController } from './controllers/login.controller';
import { UserModule } from 'src/infrastructure/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { LoginUsecase } from 'src/application/auth/usecases/login.usecase';
import { UserSerializer } from 'src/infrastructure/auth/serializers/user.serializer';
import { AdminLogoutController } from './controllers/logout.controller';
import { SessionModule } from '../session/session.module';
import { PortalAuthController } from './controllers/portal-auth.controller';
import { PortalApiAuthenticatedGuard } from './guards/portal-api-authenticated.guard';
import { AuthRateLimitService } from './auth-rate-limit.service';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    UserModule,
    SessionModule,
  ],
  controllers: [
    AdminLoginController,
    AdminLogoutController,
    PortalAuthController,
  ],
  providers: [
    LocalStrategy,
    LoginUsecase,
    UserSerializer,
    AuthRateLimitService,
    PortalApiAuthenticatedGuard,
  ],
  exports: [],
})
export class AuthModule {}
