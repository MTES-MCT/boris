import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
