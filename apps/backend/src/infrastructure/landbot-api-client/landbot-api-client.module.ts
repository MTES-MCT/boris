import { Module } from '@nestjs/common';
import { LandbotApiClientRepository } from './landbot-api-client.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'LandbotApiClientRepositoryInterface',
      useClass: LandbotApiClientRepository,
    },
    LandbotApiClientRepository,
  ],
  exports: ['LandbotApiClientRepositoryInterface', LandbotApiClientRepository],
})
export class LandbotApiClientModule {}
