import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistributorEntity } from './distributor.entity';
import { DistributorRepository } from './distributor.repository';
import { SaveDistributorUsecase } from 'src/application/distributor/usecases/save.usecase';
import { FindAllDistributorsUsecase } from 'src/application/distributor/usecases/findAll.usecase';
import { FindManyDistributorsByIdsUsecase } from 'src/application/distributor/usecases/findManyByIds.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([DistributorEntity])],
  controllers: [],
  providers: [
    {
      provide: 'DistributorRepositoryInterface',
      useClass: DistributorRepository,
    },
    SaveDistributorUsecase,
    FindAllDistributorsUsecase,
    FindManyDistributorsByIdsUsecase,
  ],
  exports: [
    'DistributorRepositoryInterface',
    SaveDistributorUsecase,
    FindAllDistributorsUsecase,
    FindManyDistributorsByIdsUsecase,
  ],
})
export class DistributorModule {}
