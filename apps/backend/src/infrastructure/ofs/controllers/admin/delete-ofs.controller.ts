import {
  Controller,
  Delete,
  Param,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { DeleteOfsUsecase } from 'src/application/ofs/usecases/delete.usecase';
import { IdDTO } from 'src/infrastructure/common/dtos/id.dto';

@ApiExcludeController()
@Controller('/ofs')
export class DeleteOfsAdminController {
  constructor(private readonly deleteOfsUsecase: DeleteOfsUsecase) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Delete(':id')
  public async deleteOfs(@Param() params: IdDTO, @Res() res: Response) {
    console.log('deleting ofs');

    try {
      await this.deleteOfsUsecase.execute(params);
      res.redirect('/ofs');
    } catch (error) {
      console.error(error);
      res.redirect('/ofs');
    }
  }
}
