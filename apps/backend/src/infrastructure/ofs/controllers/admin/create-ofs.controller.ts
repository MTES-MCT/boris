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
import { CreateOfsUsecase } from 'src/application/ofs/usecases/create.usecase';
import { CreateOfsDTO } from 'src/infrastructure/ofs/dtos/create.dto';
import { RequestWithFlash } from 'src/types/request-with-flash';

@ApiExcludeController()
@Controller('/ofs')
export class CreateOfsAdminController {
  constructor(private readonly createOfsUsecase: CreateOfsUsecase) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Post('')
  public async createOfs(
    @Body() body: CreateOfsDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.createOfsUsecase.execute(body);

      (req as RequestWithFlash).flash(
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

      (req as RequestWithFlash).flash(
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
