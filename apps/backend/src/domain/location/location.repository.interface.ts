import { LocationEntity } from 'src/infrastructure/location/location.entity';

export interface LocationRepositoryInterface {
  save(location: LocationEntity): Promise<LocationEntity>;
  findById(id: string): Promise<LocationEntity | null>;
  delete(id: string): Promise<void>;
}
