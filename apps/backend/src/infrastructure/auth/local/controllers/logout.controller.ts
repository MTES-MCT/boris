import {
  Controller,
  InternalServerErrorException,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('auth/logout')
export class LocalLogoutController {
  @Post()
  public async post(@Req() req: Request, @Res() res: Response): Promise<void> {
    const err = await new Promise((resolve) => {
      req.logout((err) => resolve(err));
    });

    if (err) {
      throw new InternalServerErrorException('Failed to log out');
    }

    console.log('HEREEEEE logout');
    res.redirect(303, '/login');
  }
}
