import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { typeormConfig } from './infrastructure/persistence/typeorm.config';
import { RegionModule } from './infrastructure/region/region.module';
import { OfsModule } from './infrastructure/ofs/ofs.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), RegionModule, OfsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
