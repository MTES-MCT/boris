import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfsEntity } from './ofs.entity';
import { OfsRepository } from './ofs.repository';
import { RegionModule } from '../region/region.module';
import { DepartementModule } from '../departement/departement.module';
import { GetOfssApiController } from './controllers/api/get-ofss.controller';
import { FindAllOfssUsecase } from 'src/application/ofs/usecases/findAll.usecase';
import { DistributorModule } from '../distributor/distributor.module';
import { GetOfssAdminController } from './controllers/admin/get-ofss.controller';
import { CreateOfsAdminController } from './controllers/admin/create-ofs.controller';
import { DeleteOfsUsecase } from 'src/application/ofs/usecases/delete.usecase';
import { DeleteOfsAdminController } from './controllers/admin/delete-ofs.controller';
import { UpdateOfsAdminController } from './controllers/admin/update-ofs.controller';
import { FindOfsByIdUsecase } from 'src/application/ofs/usecases/findById.usecase';
import { UpdateOfsUsecase } from 'src/application/ofs/usecases/update.usecase';
import { CreateOfsUsecase } from 'src/application/ofs/usecases/create.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([OfsEntity]),
    RegionModule,
    DepartementModule,
    DistributorModule,
  ],
  controllers: [
    GetOfssApiController,
    GetOfssAdminController,
    CreateOfsAdminController,
    DeleteOfsAdminController,
    UpdateOfsAdminController,
  ],
  providers: [
    { provide: 'OfsRepositoryInterface', useClass: OfsRepository },
    CreateOfsUsecase,
    FindAllOfssUsecase,
    DeleteOfsUsecase,
    FindOfsByIdUsecase,
    UpdateOfsUsecase,
  ],
  exports: [
    'OfsRepositoryInterface',
    FindAllOfssUsecase,
    CreateOfsUsecase,
    DeleteOfsUsecase,
    FindOfsByIdUsecase,
  ],
})
export class OfsModule {}
