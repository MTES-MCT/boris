import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { useSession } from './infrastructure/session/session.middleware';
import dataSource from './infrastructure/persistence/typeorm.config';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import flash = require('connect-flash');
import { configureViewEngine } from './infrastructure/config/view-engine.config';
import { configureApiDocumentation } from './infrastructure/config/api-documentation.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await useSession(app, dataSource);
  app.use(flash());
  configureViewEngine(app);
  configureApiDocumentation(app);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
