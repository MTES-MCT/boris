import { Module } from '@nestjs/common';
import { AdminHomeModule } from './home/home.module';
import { AdminAuthModule } from './auth/auth.module';
import { AdminOfsModule } from './ofs/ofs.module';

@Module({
  imports: [AdminHomeModule, AdminAuthModule, AdminOfsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AdminModule {}
