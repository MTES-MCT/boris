import { Module } from '@nestjs/common';
import { HomeModule } from './home/home.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [HomeModule, AuthModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AdminModule {}
