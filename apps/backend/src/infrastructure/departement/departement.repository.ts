import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { DepartementEntity } from './departement.entity';
import { DepartementInterface } from 'src/domain/departement/departement.interface';

@Injectable()
export class DepartementRepository implements DepartementRepositoryInterface {
  constructor(
    @InjectRepository(DepartementEntity)
    private readonly repository: Repository<DepartementEntity>,
  ) {}

  public save(
    departement: DepartementInterface,
  ): Promise<DepartementInterface> {
    return this.repository.save(departement);
  }
}
