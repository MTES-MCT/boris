import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RequestWithFlash } from 'src/types/request-with-flash';
import translations from 'src/views/utils/translations';

@Injectable()
export class ToLocalsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.locals.user = req.user;
    res.locals.translations = translations;

    const flashMessage = (req as RequestWithFlash).flash();

    if (Object.keys(flashMessage).length > 0) {
      res.locals.flashMessage = {
        title: Object.entries(flashMessage)[0][0],
        content: Object.entries(flashMessage)[0][1][0],
      };
    }

    next();
  }
}
