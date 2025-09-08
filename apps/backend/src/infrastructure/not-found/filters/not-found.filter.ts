import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  NotFoundException,
} from '@nestjs/common';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundFilter implements ExceptionFilter {
  @SentryExceptionCaptured()
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    return response.status(404).render('404', {
      layout: 'layouts/main',
      title: 'Page non trouvée',
      breadcrumbLinks: [],
    });
  }
}
