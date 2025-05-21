import { Get, Controller, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/login')
export class AdminLoginController {
  @Get()
  index(@Res() res: Response) {
    res.render('auth/login', { layout: 'layouts/auth' });
  }
}
