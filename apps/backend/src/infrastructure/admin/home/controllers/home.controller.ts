import { Get, Controller, Res, UseGuards, UseFilters } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import translations from 'src/views/utils/translations';

@ApiExcludeController()
@Controller('/')
export class AdminHomeController {
  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get()
  index(@Res() res: Response) {
    res.render('index', {
      layout: 'layouts/main',
      title: translations.contents.home.title,
      breadcrumbLinks: [],
    });
  }
}
