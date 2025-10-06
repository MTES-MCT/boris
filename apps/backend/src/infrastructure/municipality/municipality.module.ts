import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MunicipalityRepository } from './municipality.repository';
import { MunicipalityEntity } from './municipality.entity';
import { DepartementEntity } from '../departement/departement.entity';
import { DepartementRepository } from '../departement/departement.repository';
import { CreateMunicipalityUsecase } from 'src/application/municipality/usecases/create.usecase';
import { FindOneMunicipalityByInseeCodeUsecase } from 'src/application/municipality/usecases/findOneByInseeCode.usecase';
import { GetMunicipalityByInseeCodeApiController } from './controllers/api/get-municipality-by-insee-code';

@Module({
  imports: [TypeOrmModule.forFeature([DepartementEntity, MunicipalityEntity])],
  controllers: [GetMunicipalityByInseeCodeApiController],
  providers: [
    {
      provide: 'DepartementRepositoryInterface',
      useClass: DepartementRepository,
    },
    {
      provide: 'MunicipalityRepositoryInterface',
      useClass: MunicipalityRepository,
    },
    DepartementRepository,
    MunicipalityRepository,
    CreateMunicipalityUsecase,
    FindOneMunicipalityByInseeCodeUsecase,
  ],
  exports: [
    'MunicipalityRepositoryInterface',
    DepartementRepository,
    MunicipalityRepository,
    CreateMunicipalityUsecase,
  ],
})
export class MunicipalityModule {}
