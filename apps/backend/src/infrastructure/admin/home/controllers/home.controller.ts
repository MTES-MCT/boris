import { Get, Controller, Res, UseGuards, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import messages from 'src/views/utils/messages';

@Controller('/')
export class AdminHomeController {
  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get()
  index(@Res() res: Response) {
    res.render('index', {
      layout: 'layouts/main',
      title: messages.contents.home.title,
    });
  }
}
