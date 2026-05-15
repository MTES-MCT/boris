import { Get, Controller, Res, UseGuards, Post, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from '../guards/local.guard';
import { RedirectIfAuthenticatedGuard } from '../guards/redirectIfAuthenticated.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import { UserEntity } from 'src/infrastructure/user/user.entity';
import { UserRole } from 'src/domain/user/user-role.enum';

@ApiExcludeController()
@Controller('/auth')
export class AdminLoginController {
  @UseGuards(RedirectIfAuthenticatedGuard)
  @Get('/login')
  public get(@Res() res: Response) {
    res.render('auth/login', {
      layout: 'layouts/auth',
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  post(@Req() req: Request, @Res() res: Response) {
    const user = req.user as UserEntity;

    if (user.roles.includes(UserRole.ADMIN)) {
      res.redirect(303, '/');
      return;
    }

    res.redirect(303, process.env.OFS_PORTAL_URL || '/');
  }
}
