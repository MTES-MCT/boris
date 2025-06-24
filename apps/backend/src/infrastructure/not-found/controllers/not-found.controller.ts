import { Controller, Res, HttpStatus, All } from '@nestjs/common';
import { Response } from 'express';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('*')
export class NotFoundController {
  @All()
  getNotFound(@Res() res: Response) {
    return res.status(HttpStatus.NOT_FOUND).render('404', {
      layout: 'layouts/main',
      title: 'Page non trouvée',
      breadcrumbLinks: [],
    });
  }
}
