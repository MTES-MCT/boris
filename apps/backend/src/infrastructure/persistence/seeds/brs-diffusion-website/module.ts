import { Module } from '@nestjs/common';
import { BrsDiffusionWebsiteSeed } from './seed';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeocoderModule } from 'src/infrastructure/geocoder/geocoder.module';
import { DepartementModule } from 'src/infrastructure/departement/departement.module';
import { BrsDiffusionWebsiteModule } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    DepartementModule,
    GeocoderModule,
    BrsDiffusionWebsiteModule,
  ],
  providers: [BrsDiffusionWebsiteSeed],
})
export class BrsDiffusionWebsiteSeedModule {}
