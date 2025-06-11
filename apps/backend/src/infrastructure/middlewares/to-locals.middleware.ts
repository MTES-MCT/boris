import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import messages from 'src/views/utils/messages';

@Injectable()
export class ToLocalsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.locals.user = req.user;
    res.locals.messages = messages;

    next();
  }
}
