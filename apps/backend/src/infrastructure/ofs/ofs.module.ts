import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfsEntity } from './ofs.entity';
import { OfsRepository } from './ofs.repository';
import { SaveOfsUsecase } from 'src/application/ofs/usecases/save.usecase';
import { RegionModule } from '../region/region.module';
import { DepartementModule } from '../departement/departement.module';
import { GetOfssController } from './controllers/getOfss.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([OfsEntity]),
    RegionModule,
    DepartementModule,
  ],
  controllers: [GetOfssController],
  providers: [
    { provide: 'OfsRepositoryInterface', useClass: OfsRepository },
    SaveOfsUsecase,
  ],
  exports: [SaveOfsUsecase],
})
export class OfsModule {}
