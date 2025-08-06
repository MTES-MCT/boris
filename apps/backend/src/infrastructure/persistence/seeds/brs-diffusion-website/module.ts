import { Module } from '@nestjs/common';
import { BrsDiffusionWebsiteSeed } from './seed';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrsDiffusionWebsiteModule } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), BrsDiffusionWebsiteModule],
  providers: [BrsDiffusionWebsiteSeed],
})
export class BrsDiffusionWebsiteSeedModule {}
