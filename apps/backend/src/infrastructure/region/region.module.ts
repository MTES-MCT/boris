import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionEntity } from './region.entity';
import { RegionRepository } from './region.repository';
import { SaveRegionUsecase } from 'src/application/region/usecases/save.usecase';
import { FindOneRegionByNameUsecase } from 'src/application/region/usecases/findOneByName.usecase';
import { FindAllRegionsUsecase } from 'src/application/region/usecases/findAll.usecase';
import { GetBrsDiffusionWebsitesByRegionApiController } from './controllers/api/get-brs-diffusion-websites.controller';
import { FindAllBrsDiffusionWebsitesByRegionUsecase } from 'src/application/brs-diffusion-website/usecases/findAllByRegion.usecase';
import { BrsDiffusionWebsiteModule } from '../brs-diffusion-website/brs-diffusion-website.module';
import { UpdateRegionUsecase } from 'src/application/region/usecases/update.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([RegionEntity]),
    BrsDiffusionWebsiteModule,
  ],
  controllers: [GetBrsDiffusionWebsitesByRegionApiController],
  providers: [
    { provide: 'RegionRepositoryInterface', useClass: RegionRepository },
    SaveRegionUsecase,
    FindOneRegionByNameUsecase,
    FindAllRegionsUsecase,
    FindAllBrsDiffusionWebsitesByRegionUsecase,
    UpdateRegionUsecase,
  ],
  exports: [
    'RegionRepositoryInterface',
    SaveRegionUsecase,
    FindOneRegionByNameUsecase,
    FindAllRegionsUsecase,
    UpdateRegionUsecase,
  ],
})
export class RegionModule {}
