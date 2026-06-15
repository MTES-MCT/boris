import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';
import { UserRole } from './user-role.enum';

export interface UserInterface {
  id?: string;
  email: string;
  password: string;
  roles: UserRole[];
  isActive: boolean;
  ofss: OfsEntity[];
  distributor: DistributorEntity | null;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
