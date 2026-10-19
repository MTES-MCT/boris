import { PaginationProps } from 'src/domain/common/paginationProps';

export interface FindAllBrsDiffusionWebsitesParams extends PaginationProps {
  search?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}
