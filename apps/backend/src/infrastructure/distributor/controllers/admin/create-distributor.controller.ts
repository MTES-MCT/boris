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
import { CreateDistributorUsecase } from 'src/application/distributor/usecases/create.usecase';
import { CreateDistributorDTO } from 'src/infrastructure/distributor/dtos/create.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import translations from 'src/views/utils/translations';

@ApiExcludeController()
@Controller('/distributors')
export class CreateDistributorAdminController {
  constructor(
    private readonly createDistributorUsecase: CreateDistributorUsecase,
  ) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Post('')
  public async createDistributor(
    @Body() body: CreateDistributorDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.createDistributorUsecase.execute(body);

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
