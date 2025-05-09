import { PaginationProps } from '../pagination/paginationProps';
import { OfsInterface } from './ofs.interface';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';

export interface OfsRepositoryInterface {
  save(ofs: OfsInterface): Promise<OfsEntity>;
  getAll(paginationProps: PaginationProps): Promise<[OfsEntity[], number]>;
}
