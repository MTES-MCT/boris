import { PaginationProps } from 'src/domain/common/paginationProps';
import { FindAllOfsFilters } from 'src/domain/ofs/ofs.repository.interface';

export interface FindAllOfssParams extends PaginationProps, FindAllOfsFilters {}
