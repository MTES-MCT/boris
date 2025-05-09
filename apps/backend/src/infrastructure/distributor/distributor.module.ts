import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DistributorEntity } from './distributor.entity';
import { DistributorRepository } from './distributor.repository';
import { SaveDistributorUsecase } from 'src/application/distributor/usecases/save.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([DistributorEntity])],
  controllers: [],
  providers: [
    {
      provide: 'DistributorRepositoryInterface',
      useClass: DistributorRepository,
    },
    SaveDistributorUsecase,
  ],
  exports: [SaveDistributorUsecase],
})
export class DistributorModule {}
