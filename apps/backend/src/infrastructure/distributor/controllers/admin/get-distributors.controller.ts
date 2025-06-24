import {
  Get,
  Controller,
  Res,
  UseGuards,
  UseFilters,
  Query,
} from '@nestjs/common';
import { Response } from 'express';
import { MAX_PAGE_SIZE } from 'src/application/common/pagination';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import translations from 'src/views/utils/translations';
import { TableFactory } from 'src/views/factories/table.factories';
import { PaginationDTO } from 'src/infrastructure/common/dtos/pagination.dto';
import { FindAllDistributorsUsecase } from 'src/application/distributor/usecases/findAll.usecase';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('/distributors')
export class GetDistributorsAdminController {
  constructor(
    private readonly findAllDistributorsUsecase: FindAllDistributorsUsecase,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get()
  public async getDistributors(
    @Query() { page = 1, pageSize = MAX_PAGE_SIZE }: PaginationDTO,
    @Res() res: Response,
  ) {
    const distributors = await this.findAllDistributorsUsecase.execute({
      page,
      pageSize,
    });

    const { columns, rows, pagination } = TableFactory.createTable(
      translations.contents.distributors.columns || [],
      distributors,
    );

    res.render('distributor/index', {
      layout: 'layouts/main',
      title: translations.contents.distributors.title,
      breadcrumbLinks: [
        {
          label: translations.contents.distributors.title,
          href: '/distributors',
        },
      ],
      columns,
      rows,
      pagination,
    });
  }
}
