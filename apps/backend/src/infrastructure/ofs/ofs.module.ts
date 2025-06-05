import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfsEntity } from './ofs.entity';
import { OfsRepository } from './ofs.repository';
import { SaveOfsUsecase } from 'src/application/ofs/usecases/save.usecase';
import { RegionModule } from '../region/region.module';
import { DepartementModule } from '../departement/departement.module';
import { OfsApiController } from './controllers/ofs.api.controller';
import { FindAllOfssUsecase } from 'src/application/ofs/usecases/findAll.usecase';
import { DistributorModule } from '../distributor/distributor.module';
import { OfsAdminController } from './controllers/ofs.admin.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OfsEntity]),
    RegionModule,
    DepartementModule,
    DistributorModule,
  ],
  controllers: [OfsApiController, OfsAdminController],
  providers: [
    { provide: 'OfsRepositoryInterface', useClass: OfsRepository },
    SaveOfsUsecase,
    FindAllOfssUsecase,
  ],
  exports: ['OfsRepositoryInterface', FindAllOfssUsecase, SaveOfsUsecase],
})
export class OfsModule {}
