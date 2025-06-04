import {
  Get,
  Controller,
  Res,
  UseGuards,
  UseFilters,
  Query,
  Post,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { GetAllOfssUsecase } from 'src/application/ofs/usecases/getAll.usecase';
import { MAX_PAGE_SIZE } from 'src/application/pagination/pagination';
import { LocalRequireAuthFilter } from 'src/infrastructure/admin/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/admin/auth/guards/local.isAuthenticated.guard';
import messages from 'src/infrastructure/utils/messages';
import { TableFactory } from 'src/infrastructure/admin/factories/table.factories';
import { PaginationDTO } from 'src/infrastructure/pagination/pagination.dto';
import { SaveOfsUsecase } from 'src/application/ofs/usecases/save.usecase';
import { SaveOfsDTO } from 'src/infrastructure/ofs/dtos/save.dto';
import { FindAllRegionsUsecase } from 'src/application/region/usecases/findAll.usecase';
import { FindAllDepartementsUsecase } from 'src/application/departement/usecases/findAll.usecase';
import { FindAllDistributorsUsecase } from 'src/application/distributor/usecases/findAll.usecase';

@Controller('/ofs')
export class AdminOfsController {
  constructor(
    private readonly getAllOfssUsecase: GetAllOfssUsecase,
    private readonly saveOfsUsecase: SaveOfsUsecase,
    private readonly findAllRegionsUsecase: FindAllRegionsUsecase,
    private readonly findAllDepartementsUsecase: FindAllDepartementsUsecase,
    private readonly findAllDistributorsUsecase: FindAllDistributorsUsecase,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get()
  public async getAll(
    @Query() { page = 1, pageSize = MAX_PAGE_SIZE }: PaginationDTO,
    @Res() res: Response,
  ) {
    const ofss = await this.getAllOfssUsecase.execute({
      page,
      pageSize,
    });

    const regions = await this.findAllRegionsUsecase.execute();
    const departements = await this.findAllDepartementsUsecase.execute();
    const distributors = await this.findAllDistributorsUsecase.execute();

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
      regions,
      departements,
      distributors,
    });
  }

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Post('')
  public async save(@Body() body: SaveOfsDTO, @Res() res: Response) {
    try {
      await this.saveOfsUsecase.execute(body);
      res.redirect('/ofs');
    } catch (e) {
      console.log(e);
    }
  }
}
