import { Module } from '@nestjs/common';
import { RegionsDepartementsSeed } from './seed';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { DepartementModule } from 'src/infrastructure/departement/departement.module';
import { RegionModule } from 'src/infrastructure/region/region.module';
import { OfsModule } from 'src/infrastructure/ofs/ofs.module';
import { DistributorModule } from 'src/infrastructure/distributor/distributor.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    RegionModule,
    DepartementModule,
    OfsModule,
    DistributorModule,
  ],
  providers: [RegionsDepartementsSeed],
})
export class RegionsDepartementsSeedModule {}
