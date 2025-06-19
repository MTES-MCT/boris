import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistributorEntity } from './distributor.entity';
import { CreateDistributorUsecase } from 'src/application/distributor/usecases/create.usecase';
import { FindAllDistributorsUsecase } from 'src/application/distributor/usecases/findAll.usecase';
import { FindManyDistributorsByIdsUsecase } from 'src/application/distributor/usecases/findManyByIds.usecase';
import { DeleteDistributorUsecase } from 'src/application/distributor/usecases/delete.usecase';
import { CreateDistributorAdminController } from './controllers/admin/create-distributor.controller';
import { GetDistributorsAdminController } from './controllers/admin/get-distributors.controller';
import { DeleteDistributorAdminController } from './controllers/admin/delete-distributor.controller';
import { DistributorRepository } from './distributor.repository';
import { UpdateDistributorAdminController } from './controllers/admin/update-distributor.controller';
import { UpdateDistributorUsecase } from 'src/application/distributor/usecases/update.usecase';
import { FindDistributorByIdUsecase } from 'src/application/distributor/usecases/findById.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([DistributorEntity])],
  controllers: [
    CreateDistributorAdminController,
    GetDistributorsAdminController,
    DeleteDistributorAdminController,
    UpdateDistributorAdminController,
  ],
  providers: [
    CreateDistributorUsecase,
    UpdateDistributorUsecase,
    FindAllDistributorsUsecase,
    FindManyDistributorsByIdsUsecase,
    DeleteDistributorUsecase,
    FindDistributorByIdUsecase,
    {
      provide: 'DistributorRepositoryInterface',
      useClass: DistributorRepository,
    },
  ],
  exports: [
    'DistributorRepositoryInterface',
    CreateDistributorUsecase,
    UpdateDistributorUsecase,
    FindDistributorByIdUsecase,
    FindAllDistributorsUsecase,
    FindManyDistributorsByIdsUsecase,
    DeleteDistributorUsecase,
  ],
})
export class DistributorModule {}
