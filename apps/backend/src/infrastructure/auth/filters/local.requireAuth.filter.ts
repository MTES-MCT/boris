import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { SentryExceptionCaptured } from '@sentry/nestjs';
import { ForbiddenException } from '@nestjs/common';

@Catch(ForbiddenException)
export class LocalRequireAuthFilter implements ExceptionFilter {
  @SentryExceptionCaptured()
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).redirect('/auth/login');
  }
}
