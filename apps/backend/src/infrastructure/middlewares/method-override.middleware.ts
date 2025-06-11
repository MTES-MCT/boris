import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MethodOverrideMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const method: string = req.body?._method || req.query?._method;

    console.log('method', method);

    if (method && ['PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase())) {
      req.method = method.toUpperCase();
      delete req.body._method;
    }

    next();
  }
}
