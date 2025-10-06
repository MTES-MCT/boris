import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MunicipalityRepositoryInterface } from 'src/domain/municipality/municipality.repository.interface';
import { MunicipalityEntity } from './municipality.entity';

@Injectable()
export class MunicipalityRepository implements MunicipalityRepositoryInterface {
  constructor(
    @InjectRepository(MunicipalityEntity)
    private readonly repository: Repository<MunicipalityEntity>,
  ) {}

  public save(departement: MunicipalityEntity): Promise<MunicipalityEntity> {
    return this.repository.save(departement);
  }

  public findOneByInseeCode(
    inseeCode: string,
  ): Promise<MunicipalityEntity | null> {
    return this.repository.findOne({
      where: { inseeCode },
      relations: ['departement'],
    });
  }
}
