import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
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
import { UserRepositoryInterface } from 'src/domain/user/user.repository.interface';

@ApiExcludeController()
@Controller('/api/portal/auth')
export class PortalAuthController {
  constructor(
    private readonly loginUsecase: LoginUsecase,
    private readonly requestPasswordResetUsecase: RequestPasswordResetUsecase,
    private readonly resetPasswordWithTokenUsecase: ResetPasswordWithTokenUsecase,
    private readonly userSessionService: UserSessionService,
    private readonly authRateLimitService: AuthRateLimitService,
    @Inject('UserRepositoryInterface')
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  @Post('/login')
  @HttpCode(204)
  public async login(@Body() body: AdminLoginDto, @Req() req: Request) {
    const email = normalizeEmail(body.email);
    const ip = req.ip || 'unknown';

    this.authRateLimitService.assertNotLimited(
      `login:email:${email}`,
      5,
      15 * 60 * 1000,
    );
    this.authRateLimitService.assertNotLimited(
      `login:ip:${ip}`,
      5,
      15 * 60 * 1000,
    );

    try {
      const user = await this.loginUsecase.execute(body);

      if (
        !user.roles.some((role) =>
          [UserRole.ADMIN, UserRole.OFS].includes(role),
        )
      ) {
        throw new UnauthorizedException();
      }

      const session = req.session as typeof req.session & {
        previousLoginAt?: string | null;
      };

      session.previousLoginAt = user.lastLoginAt?.toISOString() || null;
      user.lastLoginAt = new Date();
      await this.userRepository.save(user);

      await new Promise<void>((resolve, reject) => {
        req.logIn(user, (error) => {
          if (error) {
            reject(error);
            return;
          }

          req.session.save((saveError) => {
            if (saveError) {
              reject(saveError);
              return;
            }

            resolve();
          });
        });
      });

      this.authRateLimitService.clear(`login:email:${email}`);
      this.authRateLimitService.clear(`login:ip:${ip}`);
    } catch (error) {
      this.authRateLimitService.hit(`login:email:${email}`, 15 * 60 * 1000);
      this.authRateLimitService.hit(`login:ip:${ip}`, 15 * 60 * 1000);
      throw error;
    }
  }

  @UseGuards(PortalApiAuthenticatedGuard)
  @Get('/me')
  public async me(@Req() req: Request) {
    const user = req.user as UserEntity;

    if (user.roles.includes(UserRole.OFS) && user.ofss.length === 0) {
      await this.userSessionService.destroyAllForUserId(user.id);
      throw new UnauthorizedException();
    }

    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      canAccessAllOfss: user.roles.includes(UserRole.ADMIN),
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

    this.authRateLimitService.assertNotLimited(
      `forgot:email:${normalizedEmail}`,
      3,
      60 * 60 * 1000,
    );
    this.authRateLimitService.assertNotLimited(
      `forgot:ip:${ip}`,
      10,
      60 * 60 * 1000,
    );

    await this.requestPasswordResetUsecase.execute(body.email);

    this.authRateLimitService.hit(
      `forgot:email:${normalizedEmail}`,
      60 * 60 * 1000,
    );
    this.authRateLimitService.hit(`forgot:ip:${ip}`, 60 * 60 * 1000);
  }

  @Post('/reset-password')
  @HttpCode(204)
  public async resetPassword(
    @Body() body: ResetPasswordDto,
    @Req() req: Request,
  ) {
    const ip = req.ip || 'unknown';
    const tokenKey = body.token.slice(0, 16);

    this.authRateLimitService.assertNotLimited(
      `reset:${ip}:${tokenKey}`,
      5,
      60 * 60 * 1000,
    );

    await this.resetPasswordWithTokenUsecase.execute(body.token, body.password);

    this.authRateLimitService.hit(`reset:${ip}:${tokenKey}`, 60 * 60 * 1000);
  }
}
