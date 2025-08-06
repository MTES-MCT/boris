import { Get, Controller, Res, UseGuards, UseFilters } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import translations from 'src/views/utils/translations';
import { FindAllOfssUsecase } from 'src/application/ofs/usecases/findAll.usecase';
import { FindAllDistributorsUsecase } from 'src/application/distributor/usecases/findAll.usecase';
import { DEFAULT_PAGINATION } from 'src/application/common/pagination';
import { FindAllBrsDiffusionWebsitesUsecase } from 'src/application/brs-diffusion-website/usecases/findAll.usecase';

@ApiExcludeController()
@Controller('/')
export class AdminHomeController {
  constructor(
    private readonly findAllOfssUsecase: FindAllOfssUsecase,
    private readonly findAllDistributorsUsecase: FindAllDistributorsUsecase,
    private readonly findAllBrsDiffusionWebsitesUsecase: FindAllBrsDiffusionWebsitesUsecase,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get()
  async index(@Res() res: Response) {
    const ofss = await this.findAllOfssUsecase.execute({
      page: 1,
      pageSize: 1,
    });

    const distributors =
      await this.findAllDistributorsUsecase.execute(DEFAULT_PAGINATION);

    const brsDiffusionWebsites =
      await this.findAllBrsDiffusionWebsitesUsecase.execute(DEFAULT_PAGINATION);

    res.render('index', {
      layout: 'layouts/main',
      title: translations.contents.home.title,
      breadcrumbLinks: [],
      ofss,
      distributors,
      brsDiffusionWebsites,
    });
  }
}
