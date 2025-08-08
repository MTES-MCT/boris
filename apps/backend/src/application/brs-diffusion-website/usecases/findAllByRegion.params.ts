import { PaginationProps } from 'src/domain/common/paginationProps';

export interface FindAllBrsDiffusionWebsitesByRegionParams
  extends PaginationProps {
  regionId: string;
}
