import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { SentryGlobalFilter, SentryModule } from '@sentry/nestjs/setup';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { typeormConfig } from './infrastructure/persistence/typeorm.config';
import { RegionModule } from './infrastructure/region/region.module';
import { OfsModule } from './infrastructure/ofs/ofs.module';
import { DepartementModule } from './infrastructure/departement/departement.module';
import { DistributorModule } from './infrastructure/distributor/distributor.module';
import { UserModule } from './infrastructure/user/user.module';
import { AuthModule } from './infrastructure/auth/auth.module';
import { AdminHomeModule } from './infrastructure/admin/home/home.module';
import { NotFoundModule } from './infrastructure/not-found/not-found.module';
import { ToLocalsMiddleware } from './infrastructure/middlewares/to-locals.middleware';
import { BrsDiffusionWebsiteModule } from './infrastructure/brs-diffusion-website/brs-diffusion-website.module';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    SentryModule.forRoot(),
    TypeOrmModule.forRoot(typeormConfig),
    LoggerModule.forRoot({
      pinoHttp: {
        enabled:
          process.env.NODE_ENV !== 'ci' && process.env.NODE_ENV !== 'test',
        transport: {
          target: 'pino-pretty',
        },
      },
    }),
    AuthModule,
    RegionModule,
    OfsModule,
    DepartementModule,
    DistributorModule,
    UserModule,
    BrsDiffusionWebsiteModule,
    AdminHomeModule,
    NotFoundModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ToLocalsMiddleware).forRoutes('*');
  }
}
