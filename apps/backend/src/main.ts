import './instrument';

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { configureViewEngine } from './infrastructure/config/view-engine.config';
import { configureApiDocumentation } from './infrastructure/config/api-documentation.config';
import { createValidationPipe } from './infrastructure/config/validation-pipe.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(createValidationPipe());

  app.set('trust proxy', 1);
  configureViewEngine(app);
  configureApiDocumentation(app);

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
