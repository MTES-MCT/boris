import {
  Get,
  Controller,
  Res,
  UseGuards,
  Post,
  Req,
  Body,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from '../guards/local.guard';
import { RedirectIfAuthenticatedGuard } from '../guards/redirectIfAuthenticated.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { UserRole } from 'src/domain/user/user-role.enum';
import { TwoFactorService } from '../two-factor.service';
import { RequestWithFlash } from 'src/types/request-with-flash';

@ApiExcludeController()
@Controller('/auth')
export class AdminLoginController {
  constructor(private readonly twoFactor: TwoFactorService) {}
  @UseGuards(RedirectIfAuthenticatedGuard)
  @Get('/login')
  public get(@Res() res: Response) {
    res.render('auth/login', {
      layout: 'layouts/auth',
    });
  }

  @Get('/two-factor')
  public getTwoFactor(@Req() req: Request, @Res() res: Response) {
    res.setHeader('Cache-Control', 'no-store');
    if (!this.twoFactor.pending(req)) {
      res.redirect(303, '/auth/login');
      return;
    }
    res.render('auth/two-factor', { layout: 'layouts/auth' });
  }

  @Post('/two-factor')
  public async verifyTwoFactor(
    @Body('code') code: unknown,
    @Req() req: RequestWithFlash,
    @Res() res: Response,
  ) {
    res.setHeader('Cache-Control', 'no-store');
    try {
      const user = await this.twoFactor.verify(req, code);
      res.redirect(
        303,
        user.roles.includes(UserRole.ADMIN)
          ? '/'
          : process.env.OFS_PORTAL_URL || '/',
      );
    } catch (error) {
      const status =
        error instanceof Error && 'getStatus' in error
          ? (error as { getStatus(): number }).getStatus()
          : 500;
      if (status !== 429) await this.twoFactor.recordFailure(status, req);
      if (!req.session) {
        res.redirect(303, '/auth/login');
        return;
      }
      req.flash(
        'Erreur',
        'Code invalide, déjà utilisé ou trop de tentatives. Réessayez plus tard ou recommencez la connexion.',
      );
      await new Promise<void>((resolve, reject) =>
        req.session.save((error) =>
          error
            ? reject(
                error instanceof Error
                  ? error
                  : new Error('Failed to save session'),
              )
            : resolve(),
        ),
      );
      res.redirect(
        303,
        this.twoFactor.pending(req) ? '/auth/two-factor' : '/auth/login',
      );
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  post(@Req() req: Request, @Res() res: Response) {
    if (this.twoFactor.pending(req)) {
      res.redirect(303, '/auth/two-factor');
      return;
    }
    const user = req.user as UserEntity;

    if (user.roles.includes(UserRole.ADMIN)) {
      res.redirect(303, '/');
      return;
    }

    res.redirect(303, process.env.OFS_PORTAL_URL || '/');
  }
}
