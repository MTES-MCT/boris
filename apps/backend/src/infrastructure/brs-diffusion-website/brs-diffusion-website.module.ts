import { Module } from '@nestjs/common';
import { BrsDiffusionWebsiteEntity } from './brs-diffusion-website.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrsDiffusionWebsiteRepository } from './brs-diffusion-website.repository';
import { FindAllBrsDiffusionWebsitesUsecase } from 'src/application/brs-diffusion-website/usecases/findAll.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([BrsDiffusionWebsiteEntity])],
  controllers: [],
  providers: [
    {
      provide: 'BrsDiffusionWebsiteRepositoryInterface',
      useClass: BrsDiffusionWebsiteRepository,
    },
    BrsDiffusionWebsiteRepository,
    FindAllBrsDiffusionWebsitesUsecase,
  ],
  exports: [
    'BrsDiffusionWebsiteRepositoryInterface',
    BrsDiffusionWebsiteRepository,
    FindAllBrsDiffusionWebsitesUsecase,
  ],
})
export class BrsDiffusionWebsiteModule {}
