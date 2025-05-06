import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DepartementEntity } from './departement.entity';
import { DepartementRepository } from './departement.repository';
import { SaveDepartementUsecase } from 'src/application/departement/save.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([DepartementEntity])],
  controllers: [],
  providers: [
    {
      provide: 'DepartementRepositoryInterface',
      useClass: DepartementRepository,
    },
    SaveDepartementUsecase,
  ],
  exports: [SaveDepartementUsecase],
})
export class DepartementModule {}
