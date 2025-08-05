import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { CreateBrsDiffusionWebsiteUsecase } from 'src/application/brs-diffusion-website/usecases/create.usecase';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { CreateBrsDiffusionWebsiteDTO } from '../../dtos/create.dto';
import { Request, Response } from 'express';
import translations from 'src/views/utils/translations';

@ApiExcludeController()
@Controller('/brs-diffusion-websites')
export class CreateBrsDiffusionWebsiteAdminController {
  constructor(
    private readonly createBrsDiffusionWebsiteUsecase: CreateBrsDiffusionWebsiteUsecase,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Post('')
  public async createBrsDiffusionWebsite(
    @Body() body: CreateBrsDiffusionWebsiteDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.createBrsDiffusionWebsiteUsecase.execute(body);

      req.flash(
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

      req.flash(
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
