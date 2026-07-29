import './instrument';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { configureViewEngine } from './infrastructure/config/view-engine.config';
import { configureApiDocumentation } from './infrastructure/config/api-documentation.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.set('trust proxy', 1);
  configureViewEngine(app);
  configureApiDocumentation(app);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
