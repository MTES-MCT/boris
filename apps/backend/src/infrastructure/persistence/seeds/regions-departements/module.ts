import { Module } from '@nestjs/common';
import { RegionsDepartementsSeed } from './seed';
import { RegionModule } from 'src/infrastructure/region/region.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), RegionModule],
  providers: [RegionsDepartementsSeed],
})
export class RegionsDepartementsSeedModule {}
