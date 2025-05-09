import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartementEntity } from './departement.entity';
import { DepartementRepository } from './departement.repository';
import { SaveDepartementUsecase } from 'src/application/departement/usecases/save.usecase';
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
    FindManyDepartementsByNamesUsecase,
  ],
  exports: [
    'DepartementRepositoryInterface',
    SaveDepartementUsecase,
    FindManyDepartementsByNamesUsecase,
  ],
})
export class DepartementModule {}
