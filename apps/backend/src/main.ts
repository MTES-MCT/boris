import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';
import { useSession } from './infrastructure/session/session.middleware';
import dataSource from './infrastructure/persistence/typeorm.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await useSession(app, dataSource);

  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Boris API')
    .setDescription('Documentation API de Boris')
    .setVersion('1.0.0')
    .build();

  const customOptions = {
    customSiteTitle: 'Documentation API de Boris',
    securitySchemes: {},
    jsonDocumentUrl: 'api/documentation/schema/json',
  };

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/documentation', app, document, customOptions);

  app.useStaticAssets(
    join(__dirname, './', 'infrastructure', 'admin', 'assets'),
  );
  app.setBaseViewsDir(
    join(__dirname, './', 'infrastructure', 'admin', 'views'),
  );
  hbs.registerPartials(
    join(__dirname, './', 'infrastructure', 'admin', 'views', 'partials'),
  );
  hbs.registerPartials(
    join(__dirname, './', 'infrastructure', 'admin', 'views', 'layouts'),
  );
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
