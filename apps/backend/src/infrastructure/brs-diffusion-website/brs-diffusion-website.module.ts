import { Module } from '@nestjs/common';
import { BrsDiffusionWebsiteEntity } from './brs-diffusion-website.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrsDiffusionWebsiteRepository } from './brs-diffusion-website.repository';

@Module({
  imports: [TypeOrmModule.forFeature([BrsDiffusionWebsiteEntity])],
  controllers: [],
  providers: [
    {
      provide: 'BrsDiffusionWebsiteRepositoryInterface',
      useClass: BrsDiffusionWebsiteRepository,
    },
    BrsDiffusionWebsiteRepository,
  ],
  exports: [
    'BrsDiffusionWebsiteRepositoryInterface',
    BrsDiffusionWebsiteRepository,
  ],
})
export class BrsDiffusionWebsiteModule {}
