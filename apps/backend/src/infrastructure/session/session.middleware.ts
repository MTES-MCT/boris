import * as passport from 'passport';
import * as session from 'express-session';
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import { SessionEntity } from './session.entity';

export async function useSession(
  app: INestApplication,
  dataSource: DataSource,
) {
  const sessionStore = new TypeormStore({
    cleanupLimit: 2,
    ttl: 60 * 60 * 24 * 7, // 1 week
  });

  await dataSource.initialize();

  const sessionRepository =
    dataSource.getRepository<SessionEntity>(SessionEntity);

  app.use(
    session({
      store: sessionStore.connect(sessionRepository),
      secret: process.env.SESSION_SECRET || 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
        sameSite: true,
        secure: ['1', 'true'].includes(process.env.SESSION_COOKIE_SECURE || ''),
      },
    }),
  );

  app.use(passport.session());
}
