import {
  Controller,
  Get,
  Param,
  Res,
  UseFilters,
  UseGuards,
  Req,
  Put,
  Body,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { IdDTO } from 'src/infrastructure/common/dtos/id.dto';
import { FindOfsByIdUsecase } from 'src/application/ofs/usecases/findById.usecase';
import translations from 'src/views/utils/translations';
import { FindAllRegionsUsecase } from 'src/application/region/usecases/findAll.usecase';
import { FindAllDepartementsUsecase } from 'src/application/departement/usecases/findAll.usecase';
import { FindAllDistributorsUsecase } from 'src/application/distributor/usecases/findAll.usecase';
import { DEFAULT_PAGINATION } from 'src/application/pagination/pagination';
import { SaveOfsUsecase } from 'src/application/ofs/usecases/save.usecase';
import { SaveOfsDTO } from '../../dtos/save.dto';

@ApiExcludeController()
@Controller('/ofs')
export class UpdateOfsAdminController {
  constructor(
    private readonly findOfsByIdUsecase: FindOfsByIdUsecase,
    private readonly saveOfsUsecase: SaveOfsUsecase,
    private readonly findAllRegionsUsecase: FindAllRegionsUsecase,
    private readonly findAllDepartementsUsecase: FindAllDepartementsUsecase,
    private readonly findAllDistributorsUsecase: FindAllDistributorsUsecase,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get(':id/update')
  public async getOfsUpdate(@Param() params: IdDTO, @Res() res: Response) {
    const ofs = await this.findOfsByIdUsecase.execute(params);

    const regions =
      await this.findAllRegionsUsecase.execute(DEFAULT_PAGINATION);

    const departements = await this.findAllDepartementsUsecase.execute({
      ...DEFAULT_PAGINATION,
      pageSize: 150,
    });

    const distributors =
      await this.findAllDistributorsUsecase.execute(DEFAULT_PAGINATION);

    return res.render('ofs/update', {
      layout: 'layouts/main',
      title: translations.contents.ofs.title,
      breadcrumbLinks: [
        {
          label: translations.contents.ofs.title,
          href: '/ofs',
        },
        {
          label: ofs.name,
        },
      ],
      ofs,
      regions,
      departements,
      distributors,
    });
  }

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Put(':id')
  public async updateOfs(
    @Param() params: IdDTO,
    @Body() body: SaveOfsDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.saveOfsUsecase.execute({ id: params.id, ...body });

      req.flash(
        translations.success.defaultLabel,
        translations.success.defaultContent,
      );

      await new Promise<void>((resolve) => {
        req.session.save(() => {
          res.redirect(303, `/ofs/${params.id}/update`);
          resolve();
        });
      });
    } catch (error) {
      console.log(error);

      req.flash(
        translations.error.defaultLabel,
        translations.error.defaultContent,
      );

      await new Promise<void>((resolve) => {
        req.session.save(() => {
          res.redirect(303, `/ofs/${params.id}/update`);
          resolve();
        });
      });
    }
  }
}
