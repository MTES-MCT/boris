import { Module } from '@nestjs/common';
import { AdminOfsController } from './controllers/ofs.controller';
import { OfsModule } from 'src/infrastructure/ofs/ofs.module';
import { RegionModule } from 'src/infrastructure/region/region.module';
import { DepartementModule } from 'src/infrastructure/departement/departement.module';
import { DistributorModule } from 'src/infrastructure/distributor/distributor.module';

@Module({
  imports: [OfsModule, RegionModule, DepartementModule, DistributorModule],
  controllers: [AdminOfsController],
  providers: [],
  exports: [],
})
export class AdminOfsModule {}
