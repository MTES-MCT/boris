import { Module } from '@nestjs/common';
import { AdminHomeController } from './controllers/home.controller';
import { OfsModule } from 'src/infrastructure/ofs/ofs.module';
import { DistributorModule } from 'src/infrastructure/distributor/distributor.module';
import { BrsDiffusionWebsiteModule } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.module';
import { RegionModule } from 'src/infrastructure/region/region.module';
import { DepartementModule } from 'src/infrastructure/departement/departement.module';

@Module({
  imports: [
    OfsModule,
    DistributorModule,
    BrsDiffusionWebsiteModule,
    RegionModule,
    DepartementModule,
  ],
  controllers: [AdminHomeController],
  providers: [],
  exports: [],
})
export class AdminHomeModule {}
