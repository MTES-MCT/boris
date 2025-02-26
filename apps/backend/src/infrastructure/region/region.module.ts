import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionEntity } from './region.entity';
import { RegionRepository } from './region.repository';
import { SaveRegionUsecase } from 'src/application/region/save.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([RegionEntity])],
  controllers: [],
  providers: [
    { provide: 'RegionRepositoryInterface', useClass: RegionRepository },
    SaveRegionUsecase,
  ],
  exports: [
    { provide: 'RegionRepositoryInterface', useClass: RegionRepository },
  ],
})
export class RegionModule {}
