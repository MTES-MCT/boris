import { AuditService } from 'src/infrastructure/audit/audit.service';
import { DataSource } from 'typeorm';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  Header,
  ForbiddenException,
  InternalServerErrorException,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { LoginUsecase } from 'src/application/auth/usecases/login.usecase';
import { RequestPasswordResetUsecase } from 'src/application/user/usecases/request-password-reset.usecase';
import { ResetPasswordWithTokenUsecase } from 'src/application/user/usecases/reset-password-with-token.usecase';
import { UserRole } from 'src/domain/user/user-role.enum';
import { UserSessionService } from 'src/infrastructure/session/user-session.service';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { ForgotPasswordDto } from '../dtos/forgot-password.dto';
import { AdminLoginDto } from '../dtos/login.dto';
import { ResetPasswordDto } from '../dtos/reset-password.dto';
import { PortalApiAuthenticatedGuard } from '../guards/portal-api-authenticated.guard';
import { AuthRateLimitService } from '../auth-rate-limit.service';
import { normalizeEmail } from 'src/application/user/utils/normalize-email';
import { ChangePasswordUsecase } from 'src/application/user/usecases/change-password.usecase';
import { ChangePasswordDto } from '../dtos/change-password.dto';
import { TwoFactorService } from '../two-factor.service';
import { TwoFactorCodeDto } from '../dtos/two-factor-code.dto';
import { EnrollmentPasswordDto } from '../dtos/enrollment-password.dto';
import { DisableTwoFactorDto } from '../dtos/disable-two-factor.dto';

@ApiExcludeController()
@Controller('/api/portal/auth')
export class PortalAuthController {
  constructor(
    private readonly auditDatabase: DataSource,
    private readonly loginUsecase: LoginUsecase,
    private readonly twoFactor: TwoFactorService,
    private readonly requestPasswordResetUsecase: RequestPasswordResetUsecase,
    private readonly resetPasswordWithTokenUsecase: ResetPasswordWithTokenUsecase,
    private readonly changePasswordUsecase: ChangePasswordUsecase,
    private readonly userSessionService: UserSessionService,
    private readonly authRateLimitService: AuthRateLimitService,
  ) {}

  @Post('/login')
  @HttpCode(204)
  public async login(
    @Body() body: AdminLoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const email = normalizeEmail(body.email);
    const ip = req.ip || 'unknown';

    await this.authRateLimitService.consume(
      `login:email:${email}`,
      5,
      15 * 60 * 1000,
    );
    await this.authRateLimitService.consume(
      `login:ip:${ip}`,
      5,
      15 * 60 * 1000,
    );

    const user = await this.loginUsecase.execute(body);

    if (
      !user.roles.some((role) =>
        [UserRole.ADMIN, UserRole.OFS, UserRole.DISTRIBUTOR].includes(role),
      )
    ) {
      throw new UnauthorizedException();
    }

    const twoFactorRequired = await this.twoFactor.start(req, user, true);

    await this.authRateLimitService.clear(`login:email:${email}`);
    await this.authRateLimitService.clear(`login:ip:${ip}`);
    if (twoFactorRequired) {
      res.status(200);
      return req.session.pendingTwoFactorEnrollmentLogin
        ? { enrollmentRequired: true }
        : { twoFactorRequired: true };
    }
  }

  @Get('/two-factor')
  public twoFactorStatus(@Req() req: Request) {
    if (!this.twoFactor.pending(req))
      throw new UnauthorizedException('TWO_FACTOR_EXPIRED');
    return { twoFactorRequired: true };
  }

  @Post('/two-factor')
  @HttpCode(204)
  public async verifyTwoFactor(
    @Body() body: TwoFactorCodeDto,
    @Req() req: Request,
  ) {
    await this.twoFactor.verify(req, body.code);
  }

  @Get('/two-factor/enrollment')
  @Header('Cache-Control', 'no-store')
  public enrollmentStatus(@Req() req: Request) {
    return this.twoFactor.enrollmentStatus(req);
  }

  @Post('/two-factor/enrollment')
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  public async beginEnrollment(
    @Req() req: Request,
    @Body() body: EnrollmentPasswordDto,
  ) {
    const user = await this.twoFactor.enrollmentUser(req);
    await this.authRateLimitService.consume(
      `enrollment-password:${user.id}`,
      5,
      15 * 60_000,
    );
    await this.loginUsecase.execute({
      email: user.email,
      password: body.currentPassword,
    });
    return this.twoFactor.beginEnrollment(req);
  }

  @Post('/two-factor/enrollment/confirm')
  @HttpCode(200)
  @Header('Cache-Control', 'no-store')
  public confirmEnrollment(
    @Req() req: Request,
    @Body() body: TwoFactorCodeDto,
  ) {
    return this.twoFactor.confirmEnrollment(req, body.code);
  }

  @Post('/two-factor/enrollment/cancel')
  @HttpCode(204)
  public cancelEnrollment(@Req() req: Request) {
    return this.twoFactor.cancelEnrollment(req);
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Post('/two-factor/disable')
  @HttpCode(204)
  public async disableTwoFactor(
    @Req() req: Request,
    @Body() body: DisableTwoFactorDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as UserEntity;
    if (user.roles.includes(UserRole.ADMIN)) {
      throw new ForbiddenException('TWO_FACTOR_REQUIRED_FOR_ADMIN');
    }
    await this.authRateLimitService.consume(
      `disable-password:${user.id}`,
      5,
      15 * 60_000,
    );
    const authenticated = await this.loginUsecase.execute({
      email: user.email,
      password: body.currentPassword,
    });
    await this.twoFactor.disable(req, authenticated, body.code);
    await this.logout(req, res);
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Get('/me')
  public async me(@Req() req: Request) {
    const user = req.user as UserEntity;

    if (user.roles.includes(UserRole.OFS) && user.ofss.length === 0) {
      await this.userSessionService.destroyAllForUserId(user.id);
      throw new UnauthorizedException();
    }

    if (user.roles.includes(UserRole.DISTRIBUTOR) && !user.distributor) {
      await this.userSessionService.destroyAllForUserId(user.id);
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      canAccessAllOfss: user.roles.includes(UserRole.ADMIN),
      distributor: user.distributor
        ? { id: user.distributor.id, name: user.distributor.name }
        : null,
      ofss: user.roles.includes(UserRole.ADMIN)
        ? []
        : user.ofss
            .slice()
            .sort((left, right) => left.name.localeCompare(right.name, 'fr'))
            .map((ofs) => ({ id: ofs.id, name: ofs.name })),
    };
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Post('/logout')
  @HttpCode(204)
  public async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as UserEntity;
    const cookieName = process.env.SESSION_COOKIE_NAME || 'boris.sid';

    await this.userSessionService.destroyAllForUserId(user.id);

    const error = await new Promise((resolve) => {
      req.logout((logoutError) => resolve(logoutError));
    });

    if (error) {
      throw new InternalServerErrorException('Failed to log out');
    }

    await new Promise<void>((resolve) => {
      req.session.destroy(() => resolve());
    });

    await new AuditService(this.auditDatabase).attempt({
      type: 'auth.logout',
      targetType: 'account',
      targetId: user?.id,
      actor: user?.id
        ? { kind: 'user', id: user.id, roles: user.roles }
        : { kind: 'anonymous' },
    });

    res.clearCookie(cookieName, {
      domain: process.env.SESSION_COOKIE_DOMAIN || undefined,
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(204);
  }

  @Post('/forgot-password')
  @HttpCode(204)
  public async forgotPassword(
    @Body() body: ForgotPasswordDto,
    @Req() req: Request,
  ) {
    const normalizedEmail = normalizeEmail(body.email);
    const ip = req.ip || 'unknown';

    await this.authRateLimitService.consume(
      `forgot:email:${normalizedEmail}`,
      3,
      60 * 60 * 1000,
    );
    await this.authRateLimitService.consume(
      `forgot:ip:${ip}`,
      10,
      60 * 60 * 1000,
    );

    await this.requestPasswordResetUsecase.execute(body.email);
  }

  @Post('/reset-password')
  @HttpCode(204)
  public async resetPassword(
    @Body() body: ResetPasswordDto,
    @Req() req: Request,
  ) {
    const ip = req.ip || 'unknown';
    const tokenKey = body.token.slice(0, 16);

    await this.authRateLimitService.consume(
      `reset:${ip}:${tokenKey}`,
      5,
      60 * 60 * 1000,
    );

    await this.resetPasswordWithTokenUsecase.execute(body.token, body.password);
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Post('/change-password')
  @HttpCode(204)
  public async changePassword(
    @Body() body: ChangePasswordDto,
    @Req() req: Request,
  ) {
    const user = req.user as UserEntity;

    await this.changePasswordUsecase.execute(
      user.id,
      body.currentPassword,
      body.newPassword,
    );
  }
}
