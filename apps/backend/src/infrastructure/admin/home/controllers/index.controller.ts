import { Get, Controller, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('/')
export class HomeController {
  @Get()
  index(@Res() res: Response) {
    const isLoggedIn = false;

    if (!isLoggedIn) {
      return res.redirect('/login');
    }
  }
}
