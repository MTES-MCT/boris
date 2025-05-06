import { Module } from '@nestjs/common';
import { RegionsDepartementsSeed } from './seed';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { DepartementModule } from 'src/infrastructure/departement/departement.module';
import { RegionModule } from 'src/infrastructure/region/region.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    RegionModule,
    DepartementModule,
  ],
  providers: [RegionsDepartementsSeed],
})
export class RegionsDepartementsSeedModule {}
