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
} from 'src/application/pagination/pagination';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import messages from 'src/views/utils/messages';
import { TableFactory } from 'src/views/factories/table.factories';
import { PaginationDTO } from 'src/infrastructure/pagination/pagination.dto';
import { FindAllRegionsUsecase } from 'src/application/region/usecases/findAll.usecase';
import { FindAllDepartementsUsecase } from 'src/application/departement/usecases/findAll.usecase';
import { FindAllDistributorsUsecase } from 'src/application/distributor/usecases/findAll.usecase';
import { ApiExcludeController } from '@nestjs/swagger';

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
    @Query() { page = 1, pageSize = MAX_PAGE_SIZE }: PaginationDTO,
    @Res() res: Response,
  ) {
    const ofss = await this.findAllOfssUsecase.execute({
      page,
      pageSize,
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
      messages.contents.ofs.columns,
      ofss,
    );

    res.render('ofs/index', {
      layout: 'layouts/main',
      title: messages.contents.ofs.title,
      breadcrumbLinks: [
        {
          label: 'OFS',
          href: '/ofs',
        },
      ],
      action: messages.contents.ofs.action.label,
      columns,
      rows,
      pagination,
      regions: regions.items,
      departements: departements.items,
      distributors: distributors.items,
    });
  }
}
