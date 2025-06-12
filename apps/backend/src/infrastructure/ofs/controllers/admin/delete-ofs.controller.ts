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
import { FlashMessageFactory } from 'src/views/factories/flash-message.factories';
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
    console.log('deleting ofs');

    try {
      await this.deleteOfsUsecase.execute(params);

      const flashMessage = FlashMessageFactory.createFlashMessage({
        type: 'success',
        message: translations.success.defaultContent,
      });

      req.flash(flashMessage.type, flashMessage.message);

      res.redirect('/ofs');
    } catch (error) {
      console.error(error);

      const flashMessage = FlashMessageFactory.createFlashMessage({
        type: 'error',
        message: translations.error.defaultContent,
      });

      req.flash(flashMessage.type, flashMessage.message);

      res.redirect('/ofs');
    }
  }
}
