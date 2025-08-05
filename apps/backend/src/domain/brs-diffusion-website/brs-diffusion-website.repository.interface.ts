import { BrsDiffusionWebsiteEntity } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.entity';
import { PaginationProps } from '../common/paginationProps';

export interface BrsDiffusionWebsiteRepositoryInterface {
  save(
    brsDiffusionWebsite: BrsDiffusionWebsiteEntity,
  ): Promise<BrsDiffusionWebsiteEntity>;
  findAll(
    paginationProps: PaginationProps,
  ): Promise<[BrsDiffusionWebsiteEntity[], number]>;
}
