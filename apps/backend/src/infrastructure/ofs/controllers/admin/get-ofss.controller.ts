import {
  Get,
  Controller,
  Res,
  UseGuards,
  UseFilters,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { FindAllOfssUsecase } from 'src/application/ofs/usecases/findAll.usecase';
import {
  DEFAULT_PAGINATION,
  MAX_PAGE_SIZE,
} from 'src/application/common/pagination';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import translations from 'src/views/utils/translations';
import { TableFactory } from 'src/views/factories/table.factories';
import { FindAllRegionsUsecase } from 'src/application/region/usecases/findAll.usecase';
import { FindAllDepartementsUsecase } from 'src/application/departement/usecases/findAll.usecase';
import { FindAllDistributorsUsecase } from 'src/application/distributor/usecases/findAll.usecase';
import { ApiExcludeController } from '@nestjs/swagger';
import { AdminOfssFiltersDTO } from '../../dtos/admin-ofss-filters.dto';

@ApiExcludeController()
@Controller('/ofs')
export class GetOfssAdminController {
  constructor(
    private readonly findAllOfssUsecase: FindAllOfssUsecase,
    private readonly findAllRegionsUsecase: FindAllRegionsUsecase,
    private readonly findAllDepartementsUsecase: FindAllDepartementsUsecase,
    private readonly findAllDistributorsUsecase: FindAllDistributorsUsecase,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get()
  public async getOfss(
    @Query()
    { page = 1, pageSize = MAX_PAGE_SIZE, search }: AdminOfssFiltersDTO,
    @Res() res: Response,
  ) {
    const normalizedSearch = search?.trim() || '';
    const ofss = await this.findAllOfssUsecase.execute({
      page,
      pageSize,
      search: normalizedSearch || undefined,
    });

    const regions =
      await this.findAllRegionsUsecase.execute(DEFAULT_PAGINATION);

    const departements = await this.findAllDepartementsUsecase.execute({
      ...DEFAULT_PAGINATION,
      pageSize: 150,
    });

    const distributors =
      await this.findAllDistributorsUsecase.execute(DEFAULT_PAGINATION);

    const { columns, rows, pagination } = TableFactory.createTable(
      translations.contents.ofs.columns || [],
      ofss,
    );

    res.render('ofs/index', {
      layout: 'layouts/main',
      title: translations.contents.ofs.title,
      breadcrumbLinks: [
        {
          label: translations.contents.ofs.title,
          href: '/ofs',
        },
      ],
      columns,
      rows,
      pagination,
      regions,
      departements,
      distributors,
      search: normalizedSearch,
    });
  }
}
