import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from 'src/infrastructure/persistence/typeorm.config';
import { UserModule } from 'src/infrastructure/user/user.module';
import { UserSeed } from './seed';

@Module({
  imports: [TypeOrmModule.forRoot(typeormConfig), UserModule],
  providers: [UserSeed],
})
export class UserSeedModule {}
