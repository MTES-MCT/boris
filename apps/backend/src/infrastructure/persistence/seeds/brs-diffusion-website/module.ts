import { Module } from '@nestjs/common';
import { BrsDiffusionWebsiteSeed } from './seed';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeocoderModule } from 'src/infrastructure/geocoder/geocoder.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), GeocoderModule],
  providers: [BrsDiffusionWebsiteSeed],
})
export class BrsDiffusionWebsiteSeedModule {}
