import { RegionEntity } from 'src/infrastructure/region/region.entity';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';

export interface OfsInterface {
  id?: string;
  name: string;
  phone: string | null;
  websiteUrl: string | null;
  email: string | null;
  producesBrs: boolean;
  isPartner: boolean;
  regions: RegionEntity[];
  departements: DepartementEntity[];
  distributors: DistributorEntity[];
  createdAt: Date;
  updatedAt: Date;
}
