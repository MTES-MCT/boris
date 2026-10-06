import { LeadNotificationOptions } from 'src/domain/ofs/lead-notification-options';
import { LocationEntity } from 'src/infrastructure/location/location.entity';

export interface LocationRepositoryInterface {
  save(
    location: LocationEntity,
    options?: LeadNotificationOptions,
  ): Promise<LocationEntity>;
  findById(id: string): Promise<LocationEntity | null>;
  delete(id: string): Promise<void>;
}
