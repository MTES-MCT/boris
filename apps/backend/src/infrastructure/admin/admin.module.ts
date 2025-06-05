import { Module } from '@nestjs/common';
import { AdminHomeModule } from './home/home.module';
import { AdminAuthModule } from './auth/auth.module';

@Module({
  imports: [AdminHomeModule, AdminAuthModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AdminModule {}
