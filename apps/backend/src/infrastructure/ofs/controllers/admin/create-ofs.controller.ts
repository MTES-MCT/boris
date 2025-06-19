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
import { SaveOfsDTO } from 'src/infrastructure/ofs/dtos/save.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import translations from 'src/views/utils/translations';
import { CreateOfsUsecase } from 'src/application/ofs/usecases/create.usecase';

@ApiExcludeController()
@Controller('/ofs')
export class CreateOfsAdminController {
  constructor(private readonly createOfsUsecase: CreateOfsUsecase) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Post('')
  public async createOfs(
    @Body() body: SaveOfsDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.createOfsUsecase.execute(body);

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
    } catch (e) {
      console.log(e);

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
