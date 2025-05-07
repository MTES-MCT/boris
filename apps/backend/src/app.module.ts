import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './infrastructure/persistence/typeorm.config';
import { RegionModule } from './infrastructure/region/region.module';
import { OfsModule } from './infrastructure/ofs/ofs.module';
import { DepartementModule } from './infrastructure/departement/departement.module';
import { DistributorModule } from './infrastructure/distributor/distributor.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    RegionModule,
    OfsModule,
    DepartementModule,
    DistributorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
