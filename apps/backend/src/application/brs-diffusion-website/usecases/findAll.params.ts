import { PaginationProps } from 'src/domain/common/paginationProps';

export interface FindAllBrsDiffusionWebsitesParams extends PaginationProps {
  latitude?: number;
  longitude?: number;
  radius?: number;
}
