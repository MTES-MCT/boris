import {
  Get,
  Controller,
  Res,
  UseGuards,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from '../guards/local.guard';
import { AdminLoginDto } from '../dtos/login.dto';
import messages from 'src/views/utils/messages';
import { RedirectIfAuthenticatedGuard } from '../guards/redirectIfAuthenticated.guard';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('/auth')
export class AdminLoginController {
  @UseGuards(RedirectIfAuthenticatedGuard)
  @Get('/login')
  public get(@Res() res: Response, @Req() req: Request) {
    res.render('auth/login', {
      layout: 'layouts/auth',
      message: req.flash(messages.errors.label),
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  post(@Res() res: Response, @Body() { email, password }: AdminLoginDto) {
    res.redirect(303, '/ofs');
  }
}
