import {
  Controller,
  Delete,
  Param,
  Req,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { DeleteBrsDiffusionWebsiteUsecase } from 'src/application/brs-diffusion-website/usecases/delete.usecase';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { IdDTO } from 'src/infrastructure/common/dtos/id.dto';
import { RequestWithFlash } from 'src/types/request-with-flash';
import translations from 'src/views/utils/translations';

@ApiExcludeController()
@Controller('/brs-diffusion-websites')
export class DeleteBrsDiffusionWebsiteAdminController {
  constructor(
    private readonly deleteBrsDiffusionWebsiteUsecase: DeleteBrsDiffusionWebsiteUsecase,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Delete(':id')
  public async deleteBrsDiffusionWebsite(
    @Param() params: IdDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.deleteBrsDiffusionWebsiteUsecase.execute(params);

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
    } catch (error) {
      console.error(error);

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
