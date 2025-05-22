import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';

import { typeormConfig } from './infrastructure/persistence/typeorm.config';

import { RegionModule } from './infrastructure/region/region.module';
import { OfsModule } from './infrastructure/ofs/ofs.module';
import { DepartementModule } from './infrastructure/departement/departement.module';
import { DistributorModule } from './infrastructure/distributor/distributor.module';
import { AdminModule } from './infrastructure/admin/admin.module';
import { UserModule } from './infrastructure/user/user.module';
import { AuthModule } from './infrastructure/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    LoggerModule.forRoot({
      pinoHttp: {
        enabled: process.env.NODE_ENV !== 'ci',
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
          },
        },
      },
    }),
    RegionModule,
    OfsModule,
    DepartementModule,
    DistributorModule,
    AdminModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
