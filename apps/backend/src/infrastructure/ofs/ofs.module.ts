import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfsEntity } from './ofs.entity';
import { OfsRepository } from './ofs.repository';
import { SaveOfsUsecase } from 'src/application/ofs/usecases/save.usecase';
import { RegionModule } from '../region/region.module';
import { DepartementModule } from '../departement/departement.module';
import { GetOfssApiController } from './controllers/api/get-ofss.controller';
import { FindAllOfssUsecase } from 'src/application/ofs/usecases/findAll.usecase';
import { DistributorModule } from '../distributor/distributor.module';
import { GetOfssAdminController } from './controllers/admin/get-ofss.controller';
import { SaveOfsAdminController } from './controllers/admin/save-ofs.controller';

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
    SaveOfsAdminController,
  ],
  providers: [
    { provide: 'OfsRepositoryInterface', useClass: OfsRepository },
    SaveOfsUsecase,
    FindAllOfssUsecase,
  ],
  exports: ['OfsRepositoryInterface', FindAllOfssUsecase, SaveOfsUsecase],
})
export class OfsModule {}
