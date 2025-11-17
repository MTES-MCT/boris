import { Module } from '@nestjs/common';
import { LandbotCustomerSeed } from './seed';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LandbotApiClientModule } from 'src/infrastructure/landbot-api-client/landbot-api-client.module';
import { LandbotCustomerModule } from 'src/infrastructure/landbot-customer/landbot-customer.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    LandbotCustomerModule,
    LandbotApiClientModule,
  ],
  providers: [LandbotCustomerSeed],
})
export class LandbotCustomerSeedModule {}
