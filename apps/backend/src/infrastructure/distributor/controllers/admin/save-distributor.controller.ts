import {
  Controller,
  Res,
  UseGuards,
  UseFilters,
  Post,
  Body,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { ApiExcludeController } from '@nestjs/swagger';
import translations from 'src/views/utils/translations';
import { SaveDistributorUsecase } from 'src/application/distributor/usecases/save.usecase';
import { SaveDistriburorDTO } from '../../dtos/save.dto';

@ApiExcludeController()
@Controller('/distributors')
export class SaveDistributorAdminController {
  constructor(
    private readonly saveDistributorUsecase: SaveDistributorUsecase,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Post('')
  public async saveDistributor(
    @Body() body: SaveDistriburorDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.saveDistributorUsecase.execute(body);

      req.flash(
        translations.success.defaultLabel,
        translations.success.defaultContent,
      );

      await new Promise<void>((resolve) => {
        req.session.save(() => {
          res.redirect(303, '/distributors');
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
          res.redirect(303, '/distributors');
          resolve();
        });
      });
    }
  }
}
