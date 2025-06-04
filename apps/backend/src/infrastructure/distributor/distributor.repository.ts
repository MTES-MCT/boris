import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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

  public findAll(): Promise<DistributorEntity[]> {
    return this.repository.find({
      order: {
        name: 'ASC',
      },
    });
  }

  public findManyByIds(ids: string[]): Promise<DistributorEntity[]> {
    return this.repository.findBy({
      id: In(ids),
    });
  }
}
