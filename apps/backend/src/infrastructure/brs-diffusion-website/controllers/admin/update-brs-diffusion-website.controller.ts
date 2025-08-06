import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { Request, Response } from 'express';
import translations from 'src/views/utils/translations';
import { UpdateBrsDiffusionWebsiteUsecase } from 'src/application/brs-diffusion-website/usecases/update.usecase';
import { UpdateBrsDiffusionWebsiteDTO } from '../../dtos/update.dto';
import { IdDTO } from 'src/infrastructure/common/dtos/id.dto';
import { FindBrsDiffusionWebsiteByIdUsecase } from 'src/application/brs-diffusion-website/usecases/findById.usecase';
import { RequestWithFlash } from 'src/types/request-with-flash';

@ApiExcludeController()
@Controller('/brs-diffusion-websites')
export class UpdateBrsDiffusionWebsiteAdminController {
  constructor(
    private readonly findBrsDiffusionWebsiteByIdUsecase: FindBrsDiffusionWebsiteByIdUsecase,
    private readonly updateBrsDiffusionWebsiteUsecase: UpdateBrsDiffusionWebsiteUsecase,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Get(':id/update')
  public async getBrsDiffusionWebsiteUpdate(
    @Param() params: IdDTO,
    @Res() res: Response,
  ) {
    const brsDiffusionWebsite =
      await this.findBrsDiffusionWebsiteByIdUsecase.execute(params);

    return res.render('brs-diffusion-website/update', {
      layout: 'layouts/main',
      title: translations.contents.brsDiffusionWebsites.title,
      breadcrumbLinks: [
        {
          label: translations.contents.brsDiffusionWebsites.title,
          href: '/brs-diffusion-websites',
        },
      ],
      brsDiffusionWebsite,
    });
  }

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Put(':id')
  public async updateBrsDiffusionWebsite(
    @Param() params: IdDTO,
    @Body() body: UpdateBrsDiffusionWebsiteDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { id } = params;

    try {
      await this.updateBrsDiffusionWebsiteUsecase.execute({
        id,
        ...body,
      });

      (req as RequestWithFlash).flash(
        translations.success.defaultLabel,
        translations.success.defaultContent,
      );

      await new Promise<void>((resolve) => {
        req.session.save(() => {
          res.redirect(303, '/brs-diffusion-websites');
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
          res.redirect(303, '/brs-diffusion-websites');
          resolve();
        });
      });
    }
  }
}
