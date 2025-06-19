import {
  Controller,
  Res,
  UseGuards,
  UseFilters,
  Body,
  Req,
  Put,
  Param,
  // Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { UpdateDistributorUsecase } from 'src/application/distributor/usecases/update.usecase';
import { UpdateDistributorDTO } from 'src/infrastructure/distributor/dtos/update.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import translations from 'src/views/utils/translations';
// import { IdDTO } from 'src/infrastructure/common/dtos/id.dto';

@ApiExcludeController()
@Controller('/distributors')
export class UpdateDistributorAdminController {
  constructor(
    private readonly updateDistributorUsecase: UpdateDistributorUsecase,
  ) {}

  // @UseGuards(LocalIsAuthenticatedGuard)
  // @UseFilters(LocalRequireAuthFilter)
  // @Get(':id/update')
  // public async getDistributorUpdate(
  //   @Param() params: IdDTO,
  //   @Res() res: Response,
  // ) {
  //   const distributor = await this.findDistributorByIdUsecase.execute(params);

  //   res.render('distributor/update', { id });
  // }

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
