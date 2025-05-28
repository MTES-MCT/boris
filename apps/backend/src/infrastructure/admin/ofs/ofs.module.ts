import { Module } from '@nestjs/common';
import { AdminOfsController } from './controllers/ofs.controller';
import { OfsModule } from 'src/infrastructure/ofs/ofs.module';

@Module({
  imports: [OfsModule],
  controllers: [AdminOfsController],
  providers: [],
  exports: [],
})
export class AdminOfsModule {}
