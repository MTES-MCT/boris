import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import { App } from 'supertest/types';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useSession } from 'src/infrastructure/session/session.middleware';
import dataSource from 'src/infrastructure/persistence/typeorm.config';
import { configureViewEngine } from 'src/infrastructure/config/view-engine.config';
import { configureApiDocumentation } from 'src/infrastructure/config/api-documentation.config';
import * as methodOverride from 'method-override';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import flash = require('connect-flash');

// add all jest-extended matchers
import * as matchers from 'jest-extended';
expect.extend(matchers);

// or just add specific matchers
import { toBeArray, toBeSealed } from 'jest-extended';
expect.extend({ toBeArray, toBeSealed });

export const setupTestingApp = async (): Promise<INestApplication<App>> => {
  // S'assurer que la connexion précédente est fermée
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication<NestExpressApplication>();

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  useSession(app);

  configureViewEngine(app);
  configureApiDocumentation(app);

  app.use(flash());
  app.use(methodOverride('_method'));

  await app.init();

  return app;
};
