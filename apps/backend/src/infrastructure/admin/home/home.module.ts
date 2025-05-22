import { Module } from '@nestjs/common';
import { HomeController } from './controllers/home.controller';

@Module({
  imports: [],
  controllers: [HomeController],
  providers: [],
  exports: [],
})
export class HomeModule {}
