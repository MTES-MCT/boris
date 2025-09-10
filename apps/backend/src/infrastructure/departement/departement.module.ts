import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartementEntity } from './departement.entity';
import { DepartementRepository } from './departement.repository';
import { SaveDepartementUsecase } from 'src/application/departement/usecases/save.usecase';
import { FindAllDepartementsUsecase } from 'src/application/departement/usecases/findAll.usecase';
import { FindManyDepartementsByNamesUsecase } from 'src/application/departement/usecases/findManyByNames.usecase';
import { RegionEntity } from '../region/region.entity';
import { RegionRepository } from '../region/region.repository';
import { GetBrsDiffusionWebsitesByDepartementApiController } from './controllers/api/get-brs-diffusion-websites.controller';
import { FindAllBrsDiffusionWebsitesByDepartementUsecase } from 'src/application/brs-diffusion-website/usecases/findAllByDepartement.usecase';
import { BrsDiffusionWebsiteEntity } from '../brs-diffusion-website/brs-diffusion-website.entity';
import { BrsDiffusionWebsiteRepository } from '../brs-diffusion-website/brs-diffusion-website.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      DepartementEntity,
      RegionEntity,
      BrsDiffusionWebsiteEntity,
    ]),
  ],
  controllers: [GetBrsDiffusionWebsitesByDepartementApiController],
  providers: [
    {
      provide: 'DepartementRepositoryInterface',
      useClass: DepartementRepository,
    },
    {
      provide: 'RegionRepositoryInterface',
      useClass: RegionRepository,
    },
    {
      provide: 'BrsDiffusionWebsiteRepositoryInterface',
      useClass: BrsDiffusionWebsiteRepository,
    },
    DepartementRepository,
    RegionRepository,
    BrsDiffusionWebsiteRepository,
    SaveDepartementUsecase,
    FindAllDepartementsUsecase,
    FindManyDepartementsByNamesUsecase,
    FindAllBrsDiffusionWebsitesByDepartementUsecase,
  ],
  exports: [
    'DepartementRepositoryInterface',
    DepartementRepository,
    SaveDepartementUsecase,
    FindAllDepartementsUsecase,
    FindManyDepartementsByNamesUsecase,
  ],
})
export class DepartementModule {}
