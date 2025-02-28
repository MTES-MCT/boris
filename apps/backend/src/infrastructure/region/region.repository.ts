import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegionRepositoryInterface } from 'src/domain/region/region.repository.interface';
import { RegionEntity } from './region.entity';
import { RegionInterface } from 'src/domain/region/region.interface';

@Injectable()
export class RegionRepository implements RegionRepositoryInterface {
  constructor(
    @InjectRepository(RegionEntity)
    private readonly repository: Repository<RegionEntity>,
  ) {}

  public save(region: RegionInterface): Promise<RegionEntity> {
    return this.repository.save(region);
  }

  public findOneByName(name: string): Promise<RegionEntity | null> {
    return this.repository.findOneBy({ name });
  }
}
