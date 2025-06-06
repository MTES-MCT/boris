import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureApiDocumentation(app: NestExpressApplication) {
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
}
