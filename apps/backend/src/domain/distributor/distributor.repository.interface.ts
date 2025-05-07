import { DistributorInterface } from './distributor.interface';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';

export interface DistributorRepositoryInterface {
  save(distributor: DistributorInterface): Promise<DistributorEntity>;
}
