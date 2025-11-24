import { Module } from '@nestjs/common';
import { DatagouvRepository } from './datagouv.repository';

@Module({
  providers: [
    {
      provide: 'DatagouvRepositoryInterface',
      useClass: DatagouvRepository,
    },
  ],
  exports: ['DatagouvRepositoryInterface'],
})
export class DatagouvModule {}
