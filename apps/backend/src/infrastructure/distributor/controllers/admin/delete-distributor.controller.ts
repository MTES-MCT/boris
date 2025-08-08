import {
  Controller,
  Delete,
  Param,
  Res,
  UseFilters,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { IdDTO } from 'src/infrastructure/common/dtos/id.dto';
import translations from 'src/views/utils/translations';
import { DeleteDistributorUsecase } from 'src/application/distributor/usecases/delete.usecase';
import { RequestWithFlash } from 'src/types/request-with-flash';

@ApiExcludeController()
@Controller('/distributors')
export class DeleteDistributorAdminController {
  constructor(
    private readonly deleteDistributorUsecase: DeleteDistributorUsecase,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Delete(':id')
  public async deleteDistributor(
    @Param() params: IdDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.deleteDistributorUsecase.execute(params);

      (req as RequestWithFlash).flash(
        translations.success.defaultLabel,
        translations.success.defaultContent,
      );

      await new Promise<void>((resolve) => {
        req.session.save(() => {
          res.redirect(303, '/distributors');
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
          res.redirect(303, '/distributors');
          resolve();
        });
      });
    }
  }
}
