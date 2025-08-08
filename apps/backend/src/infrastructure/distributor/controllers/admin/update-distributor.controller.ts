import {
  Controller,
  Res,
  UseGuards,
  UseFilters,
  Body,
  Req,
  Put,
  Param,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { UpdateDistributorUsecase } from 'src/application/distributor/usecases/update.usecase';
import { UpdateDistributorDTO } from 'src/infrastructure/distributor/dtos/update.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import translations from 'src/views/utils/translations';
import { IdDTO } from 'src/infrastructure/common/dtos/id.dto';
import { FindDistributorByIdUsecase } from 'src/application/distributor/usecases/findById.usecase';
import { RequestWithFlash } from 'src/types/request-with-flash';

@ApiExcludeController()
@Controller('/distributors')
export class UpdateDistributorAdminController {
  constructor(
    private readonly updateDistributorUsecase: UpdateDistributorUsecase,
    private readonly findDistributorByIdUsecase: FindDistributorByIdUsecase,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get(':id/update')
  public async getDistributorUpdate(
    @Param() params: IdDTO,
    @Res() res: Response,
  ) {
    const distributor = await this.findDistributorByIdUsecase.execute(params);

    return res.render('distributor/update', {
      layout: 'layouts/main',
      title: translations.contents.distributors.title,
      breadcrumbLinks: [
        {
          label: translations.contents.distributors.title,
          href: '/distributors',
        },
        {
          label: distributor.name,
        },
      ],
      distributor,
    });
  }

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Put(':id')
  public async updateDistributor(
    @Param('id') id: string,
    @Body() body: UpdateDistributorDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.updateDistributorUsecase.execute({ id, ...body });

      (req as RequestWithFlash).flash(
        translations.success.defaultLabel,
        translations.success.defaultContent,
      );

      await new Promise<void>((resolve) => {
        req.session.save(() => {
          res.redirect(303, `/distributors/${id}/update`);
          resolve();
        });
      });
    } catch (e) {
      console.log(e);

      (req as RequestWithFlash).flash(
        translations.error.defaultLabel,
        translations.error.defaultContent,
      );

      await new Promise<void>((resolve) => {
        req.session.save(() => {
          res.redirect(303, `/distributors/${id}/update`);
          resolve();
        });
      });
    }
  }
}
