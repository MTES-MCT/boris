import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionEntity } from './region.entity';
import { RegionRepository } from './region.repository';
import { SaveRegionUsecase } from 'src/application/region/usecases/save.usecase';
import { FindOneRegionByNameUsecase } from 'src/application/region/usecases/findOneByName.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([RegionEntity])],
  controllers: [],
  providers: [
    { provide: 'RegionRepositoryInterface', useClass: RegionRepository },
    SaveRegionUsecase,
    FindOneRegionByNameUsecase,
  ],
  exports: [
    'RegionRepositoryInterface',
    SaveRegionUsecase,
    FindOneRegionByNameUsecase,
  ],
})
export class RegionModule {}
