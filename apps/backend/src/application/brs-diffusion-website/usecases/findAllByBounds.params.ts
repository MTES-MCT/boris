import { PaginationProps } from 'src/domain/common/paginationProps';

export interface FindAllBrsDiffusionWebsitesByBoundsParams extends PaginationProps {
  northEastLat: number,
  northEastLng: number,
  southWestLat: number,
  southWestLng: number,
}
