import { Module } from '@nestjs/common';
import { AdminHomeController } from './controllers/home.controller';
import { OfsModule } from 'src/infrastructure/ofs/ofs.module';
import { RegionModule } from 'src/infrastructure/region/region.module';
import { DepartementModule } from 'src/infrastructure/departement/departement.module';
import { DistributorModule } from 'src/infrastructure/distributor/distributor.module';

@Module({
  imports: [OfsModule, RegionModule, DepartementModule, DistributorModule],
  controllers: [AdminHomeController],
  providers: [],
  exports: [],
})
export class AdminHomeModule {}
