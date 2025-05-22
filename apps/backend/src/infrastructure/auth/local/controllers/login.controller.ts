import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { LocalAuthGuard } from '../guards/local.guard';

@Controller('auth/login')
export class LocalLoginController {
  @UseGuards(LocalAuthGuard)
  @Post()
  index(@Res() res: Response) {
    res.redirect(303, '/');
  }
}
