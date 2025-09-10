import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configureApiDocumentation(app: NestExpressApplication) {
  const options = new DocumentBuilder()
    .setTitle('Boris API')
    .setDescription('Documentation API de Boris')
    .setVersion('1.0.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-api-key',
        in: 'header',
      },
      'Api key',
    )
    .build();

  const customOptions = {
    customSiteTitle: 'Documentation API de Boris',
    securitySchemes: {},
    jsonDocumentUrl: 'api/documentation/schema/json',
  };

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/documentation', app, document, customOptions);
}
