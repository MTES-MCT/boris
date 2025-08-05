import { Module } from '@nestjs/common';
import { AdminHomeController } from './controllers/home.controller';
import { OfsModule } from 'src/infrastructure/ofs/ofs.module';
import { DistributorModule } from 'src/infrastructure/distributor/distributor.module';
import { BrsDiffusionWebsiteModule } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.module';

@Module({
  imports: [OfsModule, DistributorModule, BrsDiffusionWebsiteModule],
  controllers: [AdminHomeController],
  providers: [],
  exports: [],
})
export class AdminHomeModule {}
