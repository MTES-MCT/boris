import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartementEntity } from './departement.entity';
import { DepartementRepository } from './departement.repository';
import { SaveDepartementUsecase } from 'src/application/departement/usecases/save.usecase';
import { FindAllDepartementsUsecase } from 'src/application/departement/usecases/findAll.usecase';
import { FindManyDepartementsByNamesUsecase } from 'src/application/departement/usecases/findManyByNames.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([DepartementEntity])],
  controllers: [],
  providers: [
    {
      provide: 'DepartementRepositoryInterface',
      useClass: DepartementRepository,
    },
    SaveDepartementUsecase,
    FindAllDepartementsUsecase,
    FindManyDepartementsByNamesUsecase,
  ],
  exports: [
    'DepartementRepositoryInterface',
    SaveDepartementUsecase,
    FindAllDepartementsUsecase,
    FindManyDepartementsByNamesUsecase,
  ],
})
export class DepartementModule {}
