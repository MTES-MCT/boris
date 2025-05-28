import { Module } from '@nestjs/common';
import { AdminHomeController } from './controllers/home.controller';

@Module({
  imports: [],
  controllers: [AdminHomeController],
  providers: [],
  exports: [],
})
export class AdminHomeModule {}
