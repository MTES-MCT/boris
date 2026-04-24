import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class TrustedOriginMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    if (
      ['GET', 'HEAD', 'OPTIONS'].includes(req.method) ||
      process.env.NODE_ENV === 'test'
    ) {
      next();
      return;
    }

    const protectedPrefixes = [
      '/auth',
      '/users',
      '/ofs',
      '/distributors',
      '/brs-diffusion-websites',
      '/api/portal',
    ];

    if (!protectedPrefixes.some((prefix) => req.path.startsWith(prefix))) {
      next();
      return;
    }

    const originHeader = req.get('origin') || req.get('referer');
    const allowedOrigins = [
      process.env.ADMIN_APP_URL,
      process.env.OFS_PORTAL_URL,
    ]
      .filter(Boolean)
      .map((origin) => origin as string);

    if (
      !originHeader ||
      !allowedOrigins.some((origin) => originHeader.startsWith(origin))
    ) {
      throw new ForbiddenException();
    }

    next();
  }
}
