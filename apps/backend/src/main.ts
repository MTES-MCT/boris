import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useLogger(app.get(Logger));
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

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

  app.useStaticAssets(join(__dirname, './', 'infrastructure', 'public'));
  app.setBaseViewsDir(join(__dirname, './', 'infrastructure', 'views'));
  app.setViewEngine('hbs');

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
