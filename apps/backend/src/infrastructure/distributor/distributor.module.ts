import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistributorEntity } from './distributor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DistributorEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class DistributorModule {}
