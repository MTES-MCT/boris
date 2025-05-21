import { Module } from '@nestjs/common';
import { AdminLoginController } from './controllers/login.controller';

@Module({
  imports: [],
  controllers: [AdminLoginController],
  providers: [],
  exports: [],
})
export class AuthModule {}
