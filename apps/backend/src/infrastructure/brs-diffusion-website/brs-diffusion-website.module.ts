import { Module } from '@nestjs/common';
import { BrsDiffusionWebsiteEntity } from './brs-diffusion-website.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrsDiffusionWebsiteRepository } from './brs-diffusion-website.repository';
import { FindAllBrsDiffusionWebsitesUsecase } from 'src/application/brs-diffusion-website/usecases/findAll.usecase';
import { GetBrsDiffusionWebsitesAdminController } from './controllers/admin/get-brs-diffusion-websites.controller';
import { CreateBrsDiffusionWebsiteUsecase } from 'src/application/brs-diffusion-website/usecases/create.usecase';
import { GeocoderModule } from 'src/infrastructure/geocoder/geocoder.module';
import { DepartementModule } from '../departement/departement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BrsDiffusionWebsiteEntity]),
    DepartementModule,
    GeocoderModule,
  ],
  controllers: [GetBrsDiffusionWebsitesAdminController],
  providers: [
    {
      provide: 'BrsDiffusionWebsiteRepositoryInterface',
      useClass: BrsDiffusionWebsiteRepository,
    },
    BrsDiffusionWebsiteRepository,
    FindAllBrsDiffusionWebsitesUsecase,
    CreateBrsDiffusionWebsiteUsecase,
  ],
  exports: [
    'BrsDiffusionWebsiteRepositoryInterface',
    BrsDiffusionWebsiteRepository,
    FindAllBrsDiffusionWebsitesUsecase,
    CreateBrsDiffusionWebsiteUsecase,
  ],
})
export class BrsDiffusionWebsiteModule {}
