import { Get, Controller, Res, UseGuards, UseFilters } from '@nestjs/common';
import { Response } from 'express';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/local/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/local/guards/local.isAuthenticated.guard';

@Controller('/')
export class HomeController {
  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get()
  index(@Res() res: Response) {
    res.render('index', { layout: 'layouts/main' });
  }
}
