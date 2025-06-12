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
import { SaveOfsUsecase } from 'src/application/ofs/usecases/save.usecase';
import { SaveOfsDTO } from 'src/infrastructure/ofs/dtos/save.dto';
import { ApiExcludeController } from '@nestjs/swagger';
import { FlashMessageFactory } from 'src/views/factories/flash-message.factories';
import translations from 'src/views/utils/translations';

@ApiExcludeController()
@Controller('/ofs')
export class SaveOfsAdminController {
  constructor(private readonly saveOfsUsecase: SaveOfsUsecase) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Post('')
  public async saveOfs(
    @Body() body: SaveOfsDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.saveOfsUsecase.execute(body);

      const flashMessage = FlashMessageFactory.createFlashMessage({
        type: 'success',
        message: translations.success.defaultContent,
      });

      req.flash(flashMessage.type, flashMessage.message);

      res.redirect('/ofs');
    } catch (e) {
      console.log(e);

      const flashMessage = FlashMessageFactory.createFlashMessage({
        type: 'error',
        message: translations.error.defaultContent,
      });

      req.flash(flashMessage.type, flashMessage.message);

      res.redirect('/ofs');
    }
  }
}
