import { Module } from '@nestjs/common';
import { HomeController } from './controllers/index.controller';

@Module({
  imports: [],
  controllers: [HomeController],
  providers: [],
  exports: [],
})
export class HomeModule {}
