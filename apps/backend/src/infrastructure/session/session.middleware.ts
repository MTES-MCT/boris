import * as passport from 'passport';
import * as session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from './session.entity';
import { NestExpressApplication } from '@nestjs/platform-express';

export function useSession(app: NestExpressApplication) {
  const dataSource = app.get(DataSource);
  const ttl = 60 * 60 * 24; // 24h

  const sessionRepository =
    dataSource.getRepository<SessionEntity>(SessionEntity);

  const sessionStore = new TypeormStore({
    cleanupLimit: 2,
    ttl,
  }).connect(sessionRepository);

  app.use(
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
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.set('trust proxy', 1);
}
