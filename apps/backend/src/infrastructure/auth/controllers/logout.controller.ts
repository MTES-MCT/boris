import {
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('/auth')
export class AdminLogoutController {
  @Post('/logout')
  public async post(@Req() req: Request, @Res() res: Response): Promise<void> {
    const err = await new Promise((resolve) => {
      req.logout((err) => resolve(err));
    });

    if (err) {
      throw new InternalServerErrorException('Failed to log out');
    }

    res.redirect(303, '/auth/login');
  }
}
