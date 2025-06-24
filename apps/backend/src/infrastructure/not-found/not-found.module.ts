import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { NotFoundController } from './controllers/not-found.controller';
import { NotFoundFilter } from './filters/not-found.filter';

@Module({
  controllers: [NotFoundController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: NotFoundFilter,
    },
  ],
})
export class NotFoundModule {}
