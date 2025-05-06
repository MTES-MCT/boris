import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfsEntity } from './ofs.entity';
import { OfsInterface } from 'src/domain/ofs/ofs.interface';
import { OfsRepositoryInterface } from 'src/domain/ofs/ofs.repository.interface';

@Injectable()
export class OfsRepository implements OfsRepositoryInterface {
  constructor(
    @InjectRepository(OfsEntity)
    private readonly repository: Repository<OfsEntity>,
  ) {}

  public save(ofs: OfsInterface): Promise<OfsEntity> {
    return this.repository.save(ofs);
  }
}
