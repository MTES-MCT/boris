import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationRepositoryInterface } from 'src/domain/location/location.repository.interface';
import { LocationEntity } from './location.entity';

@Injectable()
export class LocationRepository implements LocationRepositoryInterface {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly repository: Repository<LocationEntity>,
  ) {}

  public save(location: LocationEntity): Promise<LocationEntity> {
    return this.repository.save(location);
  }
}
