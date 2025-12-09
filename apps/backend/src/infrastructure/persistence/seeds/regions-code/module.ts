import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { RegionModule } from 'src/infrastructure/region/region.module';
import { RegionsCodeSeed } from './seed';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), RegionModule],
  providers: [RegionsCodeSeed],
})
export class RegionsCodeSeedModule {}
