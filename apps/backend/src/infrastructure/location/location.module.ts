import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from './location.entity';
import { LocationRepository } from './location.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity])],
  providers: [
    {
      provide: 'LocationRepositoryInterface',
      useClass: LocationRepository,
    },
    LocationRepository,
  ],
  exports: ['LocationRepositoryInterface', LocationRepository],
})
export class LocationModule {}
