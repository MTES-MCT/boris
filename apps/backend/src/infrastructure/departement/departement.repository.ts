import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { DepartementEntity } from './departement.entity';
import { DepartementInterface } from 'src/domain/departement/departement.interface';
import { PaginationProps } from 'src/domain/common/paginationProps';

@Injectable()
export class DepartementRepository implements DepartementRepositoryInterface {
  constructor(
    @InjectRepository(DepartementEntity)
    private readonly repository: Repository<DepartementEntity>,
  ) {}

  public save(departement: DepartementInterface): Promise<DepartementEntity> {
    return this.repository.save(departement);
  }

  public findOneByName(name: string): Promise<DepartementEntity | null> {
    return this.repository.findOneBy({ name });
  }

  public findOneByCode(code: string): Promise<DepartementEntity | null> {
    return this.repository.findOne({ where: { code }, relations: ['region'] });
  }

  public findManyByNames(names: string[]): Promise<DepartementEntity[]> {
    return this.repository.findBy({
      name: In(names),
    });
  }

  public findAll(
    paginationProps: PaginationProps,
  ): Promise<[DepartementEntity[], number]> {
    const { pageSize, page } = paginationProps;

    const query = this.repository
      .createQueryBuilder('departement')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('departement.code', 'ASC');

    return query.getManyAndCount();
  }
}
