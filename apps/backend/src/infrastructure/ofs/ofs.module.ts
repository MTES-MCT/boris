import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfsEntity } from './ofs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OfsEntity])],
  controllers: [],
  providers: [],
  exports: [],
})
export class OfsModule {}
