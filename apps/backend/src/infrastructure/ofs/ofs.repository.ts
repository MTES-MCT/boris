import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfsEntity } from './ofs.entity';
import { OfsInterface } from 'src/domain/ofs/ofs.interface';
import { OfsRepositoryInterface } from 'src/domain/ofs/ofs.repository.interface';
import { PaginationProps } from 'src/domain/pagination/paginationProps';

@Injectable()
export class OfsRepository implements OfsRepositoryInterface {
  constructor(
    @InjectRepository(OfsEntity)
    private readonly repository: Repository<OfsEntity>,
  ) {}

  public save(ofs: OfsInterface): Promise<OfsEntity> {
    return this.repository.save(ofs);
  }

  public findAll(
    paginationProps: PaginationProps,
  ): Promise<[OfsEntity[], number]> {
    const { pageSize, page } = paginationProps;

    const query = this.repository
      .createQueryBuilder('ofs')
      .leftJoinAndSelect('ofs.departements', 'departements')
      .leftJoinAndSelect('ofs.regions', 'regions')
      .leftJoinAndSelect('ofs.distributors', 'distributors')
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('ofs.createdAt', 'DESC');

    return query.getManyAndCount();
  }

  public async findById(id: string): Promise<OfsEntity | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['departements', 'regions', 'distributors'],
    });
  }

  public async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
