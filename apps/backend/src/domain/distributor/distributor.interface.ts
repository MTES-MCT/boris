import { OfsInterface } from '../ofs/ofs.interface';

export interface DistributorInterface {
  id?: string;
  name: string;
  websiteUrl: string;
  ofss: OfsInterface[];
  createdAt: Date;
  updatedAt: Date;
}
