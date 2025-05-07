import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DistributorRepositoryInterface } from 'src/domain/distributor/distributor.repository.interface';
import { DistributorEntity } from './distributor.entity';
import { DistributorInterface } from 'src/domain/distributor/distributor.interface';

@Injectable()
export class DistributorRepository implements DistributorRepositoryInterface {
  constructor(
    @InjectRepository(DistributorEntity)
    private readonly repository: Repository<DistributorEntity>,
  ) {}

  public save(distributor: DistributorInterface): Promise<DistributorEntity> {
    return this.repository.save(distributor);
  }
}
