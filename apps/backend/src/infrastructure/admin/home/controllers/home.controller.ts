import { Get, Controller, Res, UseGuards, UseFilters } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import translations from 'src/views/utils/translations';
import { FindAllOfssUsecase } from 'src/application/ofs/usecases/findAll.usecase';
import { FindAllRegionsUsecase } from 'src/application/region/usecases/findAll.usecase';
import { FindAllDepartementsUsecase } from 'src/application/departement/usecases/findAll.usecase';
import { FindAllDistributorsUsecase } from 'src/application/distributor/usecases/findAll.usecase';
import { DEFAULT_PAGINATION } from 'src/application/pagination/pagination';

@ApiExcludeController()
@Controller('/')
export class AdminHomeController {
  constructor(
    private readonly findAllOfssUsecase: FindAllOfssUsecase,
    private readonly findAllRegionsUsecase: FindAllRegionsUsecase,
    private readonly findAllDepartementsUsecase: FindAllDepartementsUsecase,
    private readonly findAllDistributorsUsecase: FindAllDistributorsUsecase,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get()
  async index(@Res() res: Response) {
    const ofss = await this.findAllOfssUsecase.execute({
      page: 1,
      pageSize: 1,
    });

    const regions =
      await this.findAllRegionsUsecase.execute(DEFAULT_PAGINATION);

    const departements = await this.findAllDepartementsUsecase.execute({
      ...DEFAULT_PAGINATION,
      pageSize: 150,
    });

    const distributors =
      await this.findAllDistributorsUsecase.execute(DEFAULT_PAGINATION);

    res.render('index', {
      layout: 'layouts/main',
      title: translations.contents.home.title,
      breadcrumbLinks: [],
      ofss,
      regions,
      departements,
      distributors,
    });
  }
}
