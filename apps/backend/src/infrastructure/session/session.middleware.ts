import * as passport from 'passport';
import * as session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from './session.entity';
import { RequestHandler } from 'express';

export function sessionMiddlewares(dataSource: DataSource): RequestHandler[] {
  const ttl = 60 * 60 * 24; // 24h
  const test = process.env.NODE_ENV === 'test';

  const sessionStore = test
    ? undefined
    : new TypeormStore({
        cleanupLimit: 2,
        ttl,
      }).connect(dataSource.getRepository<SessionEntity>(SessionEntity));

  return [
    session({
      name: process.env.SESSION_COOKIE_NAME || 'boris.sid',
      store: sessionStore,
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
      rolling: true,
      cookie: {
        domain: process.env.SESSION_COOKIE_DOMAIN || undefined,
        httpOnly: true,
        maxAge: 1000 * ttl,
        path: '/',
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      },
    }),
    passport.initialize(),
    passport.session(),
  ];
}
