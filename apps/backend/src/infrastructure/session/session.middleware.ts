import * as passport from 'passport';
import * as session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from './session.entity';
import { NestExpressApplication } from '@nestjs/platform-express';

export function useSession(app: NestExpressApplication) {
  const dataSource = app.get(DataSource);

  const sessionRepository =
    dataSource.getRepository<SessionEntity>(SessionEntity);

  const sessionStore = new TypeormStore({
    cleanupLimit: 2,
    ttl: 60 * 60 * 24 * 7, // 1 week
  }).connect(sessionRepository);

  app.use(
    session({
      store: sessionStore,
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
  app.set('trust proxy', 1);
}
