import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './session.entity';
import { UserSessionService } from './user-session.service';

@Module({
  imports: [TypeOrmModule.forFeature([SessionEntity])],
  providers: [UserSessionService],
  exports: [UserSessionService],
})
export class SessionModule {}
