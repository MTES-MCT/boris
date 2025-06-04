import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfsEntity } from './ofs.entity';
import { OfsRepository } from './ofs.repository';
import { SaveOfsUsecase } from 'src/application/ofs/usecases/save.usecase';
import { RegionModule } from '../region/region.module';
import { DepartementModule } from '../departement/departement.module';
import { GetAllController } from './controllers/getAll.controller';
import { GetAllOfssUsecase } from 'src/application/ofs/usecases/getAll.usecase';
import { DistributorModule } from '../distributor/distributor.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OfsEntity]),
    RegionModule,
    DepartementModule,
    DistributorModule,
  ],
  controllers: [GetAllController],
  providers: [
    { provide: 'OfsRepositoryInterface', useClass: OfsRepository },
    SaveOfsUsecase,
    GetAllOfssUsecase,
  ],
  exports: ['OfsRepositoryInterface', GetAllOfssUsecase, SaveOfsUsecase],
})
export class OfsModule {}
