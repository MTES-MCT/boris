import {
  Controller,
  Get,
  Query,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import { FindAllBrsDiffusionWebsitesUsecase } from 'src/application/brs-diffusion-website/usecases/findAll.usecase';
import { MAX_PAGE_SIZE } from 'src/application/common/pagination';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { PaginationDTO } from 'src/infrastructure/common/dtos/pagination.dto';
import translations from 'src/views/utils/translations';
import { TableFactory } from 'src/views/factories/table.factories';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';

@ApiExcludeController()
@Controller('/brs-diffusion-websites')
export class GetBrsDiffusionWebsitesAdminController {
  constructor(
    private readonly findAllBrsDiffusionWebsitesUsecase: FindAllBrsDiffusionWebsitesUsecase,
    @InjectRepository(OfsEntity)
    private readonly ofsRepository: Repository<OfsEntity>,
    @InjectRepository(DistributorEntity)
    private readonly distributorRepository: Repository<DistributorEntity>,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get()
  public async getBrsDiffusionWebsites(
    @Query() { page = 1, pageSize = MAX_PAGE_SIZE }: PaginationDTO,
    @Res() res: Response,
  ) {
    const [brsDiffusionWebsites, ofss, distributors] = await Promise.all([
      this.findAllBrsDiffusionWebsitesUsecase.execute({
        page,
        pageSize,
      }),
      this.ofsRepository.find({ order: { name: 'ASC' } }),
      this.distributorRepository.find({ order: { name: 'ASC' } }),
    ]);

    const { columns, rows, pagination } = TableFactory.createTable(
      translations.contents.brsDiffusionWebsites.columns || [],
      brsDiffusionWebsites,
    );

    res.render('brs-diffusion-website/index', {
      layout: 'layouts/main',
      title: translations.contents.brsDiffusionWebsites.title,
      breadcrumbLinks: [
        {
          label: translations.contents.brsDiffusionWebsites.title,
          href: '/brs-diffusion-websites',
        },
      ],
      columns,
      rows,
      pagination,
      ofss,
      distributors,
    });
  }
}
