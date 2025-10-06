import { Module } from '@nestjs/common';
import { MunicipalitySeed } from './seed';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MunicipalityModule } from 'src/infrastructure/municipality/municipality.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), MunicipalityModule],
  providers: [MunicipalitySeed],
})
export class MunicipalitySeedModule {}
