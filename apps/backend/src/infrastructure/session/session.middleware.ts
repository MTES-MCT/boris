import * as passport from 'passport';
import * as session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from './session.entity';
import { RequestHandler } from 'express';
import { Logger } from '@nestjs/common';

const logger = new Logger('SessionStore');

export function sessionMiddlewares(dataSource: DataSource): RequestHandler[] {
  const ttl = 60 * 60 * 24; // 24h
  const test = process.env.NODE_ENV === 'test';
  const sessionSecret = process.env.SESSION_SECRET;

  if (!sessionSecret && !test) {
    throw new Error('SESSION_SECRET must be set');
  }

  const sessionStore = test
    ? undefined
    : new TypeormStore({
        cleanupLimit: 2,
        ttl,
        // The default handler disconnects the store permanently after any DB error.
        // Keep later requests retrying; the failing operation still returns its error.
        onError: (_store, error) => {
          logger.error('Session database operation failed', error.stack);
        },
      }).connect(dataSource.getRepository<SessionEntity>(SessionEntity));

  return [
    session({
      name: process.env.SESSION_COOKIE_NAME || 'boris.sid',
      store: sessionStore,
      secret: sessionSecret || 'test-secret-not-for-prod',
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
