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
import { DeleteOfsUsecase } from 'src/application/ofs/usecases/delete.usecase';
import { IdDTO } from 'src/infrastructure/common/dtos/id.dto';
import translations from 'src/views/utils/translations';

@ApiExcludeController()
@Controller('/ofs')
export class DeleteOfsAdminController {
  constructor(private readonly deleteOfsUsecase: DeleteOfsUsecase) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Delete(':id')
  public async deleteOfs(
    @Param() params: IdDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.deleteOfsUsecase.execute(params);

      req.flash(
        translations.success.defaultLabel,
        translations.success.defaultContent,
      );

      await new Promise<void>((resolve) => {
        req.session.save(() => {
          res.redirect(303, '/ofs');
          resolve();
        });
      });
    } catch (error) {
      console.error(error);

      req.flash(
        translations.error.defaultLabel,
        translations.error.defaultContent,
      );

      await new Promise<void>((resolve) => {
        req.session.save(() => {
          res.redirect(303, '/ofs');
          resolve();
        });
      });
    }
  }
}
