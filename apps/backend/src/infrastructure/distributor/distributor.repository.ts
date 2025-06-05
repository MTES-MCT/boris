import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DistributorRepositoryInterface } from 'src/domain/distributor/distributor.repository.interface';
import { DistributorEntity } from './distributor.entity';
import { DistributorInterface } from 'src/domain/distributor/distributor.interface';
import { PaginationProps } from 'src/domain/pagination/paginationProps';

@Injectable()
export class DistributorRepository implements DistributorRepositoryInterface {
  constructor(
    @InjectRepository(DistributorEntity)
    private readonly repository: Repository<DistributorEntity>,
  ) {}

  public save(distributor: DistributorInterface): Promise<DistributorEntity> {
    return this.repository.save(distributor);
  }

  public findAll(
    paginationProps: PaginationProps,
  ): Promise<[DistributorEntity[], number]> {
    const { pageSize, page } = paginationProps;

    const query = this.repository
      .createQueryBuilder('distributor')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('distributor.name', 'ASC');

    return query.getManyAndCount();
  }

  public findManyByIds(ids: string[]): Promise<DistributorEntity[]> {
    return this.repository.findBy({
      id: In(ids),
    });
  }
}
