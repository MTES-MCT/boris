import { Module } from '@nestjs/common';
import { BrsDiffusionWebsiteEntity } from './brs-diffusion-website.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrsDiffusionWebsiteRepository } from './brs-diffusion-website.repository';
import { FindAllBrsDiffusionWebsitesUsecase } from 'src/application/brs-diffusion-website/usecases/findAll.usecase';
import { GetBrsDiffusionWebsitesAdminController } from './controllers/admin/get-brs-diffusion-websites.controller';
import { CreateBrsDiffusionWebsiteUsecase } from 'src/application/brs-diffusion-website/usecases/create.usecase';
import { GeocoderModule } from 'src/infrastructure/geocoder/geocoder.module';
import { DepartementModule } from '../departement/departement.module';
import { CreateBrsDiffusionWebsiteAdminController } from './controllers/admin/create-brs-diffusion-website.controller';
import { DeleteBrsDiffusionWebsiteUsecase } from 'src/application/brs-diffusion-website/usecases/delete.usecase';
import { DeleteBrsDiffusionWebsiteAdminController } from './controllers/admin/delete-brs-diffusion-website.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BrsDiffusionWebsiteEntity]),
    DepartementModule,
    GeocoderModule,
  ],
  controllers: [
    GetBrsDiffusionWebsitesAdminController,
    CreateBrsDiffusionWebsiteAdminController,
    DeleteBrsDiffusionWebsiteAdminController,
  ],
  providers: [
    {
      provide: 'BrsDiffusionWebsiteRepositoryInterface',
      useClass: BrsDiffusionWebsiteRepository,
    },
    BrsDiffusionWebsiteRepository,
    FindAllBrsDiffusionWebsitesUsecase,
    CreateBrsDiffusionWebsiteUsecase,
    DeleteBrsDiffusionWebsiteUsecase,
    DeleteBrsDiffusionWebsiteAdminController,
  ],
  exports: [
    'BrsDiffusionWebsiteRepositoryInterface',
    BrsDiffusionWebsiteRepository,
    FindAllBrsDiffusionWebsitesUsecase,
    CreateBrsDiffusionWebsiteUsecase,
    DeleteBrsDiffusionWebsiteUsecase,
  ],
})
export class BrsDiffusionWebsiteModule {}
