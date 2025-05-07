import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartementEntity } from './departement.entity';
import { DepartementRepository } from './departement.repository';
import { SaveDepartementUsecase } from 'src/application/departement/save.usecase';
import { FindManyDepartementsByNamesUsecase } from 'src/application/departement/findManyByNames.usecase';

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
  exports: [SaveDepartementUsecase, FindManyDepartementsByNamesUsecase],
})
export class DepartementModule {}
