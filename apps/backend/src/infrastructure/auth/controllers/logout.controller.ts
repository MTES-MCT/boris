import {
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import { UserSessionService } from 'src/infrastructure/session/user-session.service';
import { UserEntity } from 'src/infrastructure/user/user.entity';

@ApiExcludeController()
@Controller('/auth')
export class AdminLogoutController {
  constructor(private readonly userSessionService: UserSessionService) {}

  @Post('/logout')
  public async post(@Req() req: Request, @Res() res: Response): Promise<void> {
    const user = req.user as UserEntity | undefined;
    const cookieName = process.env.SESSION_COOKIE_NAME || 'boris.sid';

    if (user?.id) {
      await this.userSessionService.destroyAllForUserId(user.id);
    }

    const err = await new Promise((resolve) => {
      req.logout((err) => resolve(err));
    });

    if (err) {
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

    res.redirect(303, '/auth/login');
  }
}
