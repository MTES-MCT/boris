import { PaginationProps } from 'src/domain/common/paginationProps';

export interface FindAllBrsDiffusionWebsitesByDepartementParams
  extends PaginationProps {
  departementId: string;
}
