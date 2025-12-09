import { PaginationProps } from '../common/paginationProps';
import { OfsInterface } from './ofs.interface';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';

export type FindAllOfsFilters = {
  isPartner?: boolean;
};

export interface OfsRepositoryInterface {
  save(ofs: OfsInterface): Promise<OfsEntity>;
  findAll(
    paginationProps: PaginationProps,
    filters?: FindAllOfsFilters,
  ): Promise<[OfsEntity[], number]>;
  findById(id: string): Promise<OfsEntity | null>;
  delete(id: string): Promise<void>;
}
