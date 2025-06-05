import {
  Controller,
  Res,
  UseGuards,
  UseFilters,
  Post,
  Body,
} from '@nestjs/common';
import { Response } from 'express';
import { LocalRequireAuthFilter } from 'src/infrastructure/auth/filters/local.requireAuth.filter';
import { LocalIsAuthenticatedGuard } from 'src/infrastructure/auth/guards/local.isAuthenticated.guard';
import { SaveOfsUsecase } from 'src/application/ofs/usecases/save.usecase';
import { SaveOfsDTO } from 'src/infrastructure/ofs/dtos/save.dto';

@Controller('/ofs')
export class SaveOfsAdminController {
  constructor(private readonly saveOfsUsecase: SaveOfsUsecase) {}

  @UseGuards(LocalIsAuthenticatedGuard)
  @UseFilters(LocalRequireAuthFilter)
  @Post('')
  public async saveOfs(@Body() body: SaveOfsDTO, @Res() res: Response) {
    try {
      await this.saveOfsUsecase.execute(body);
      res.redirect('/ofs');
    } catch (e) {
      console.log(e);
    }
  }
}
