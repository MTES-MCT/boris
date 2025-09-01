import { Inject } from '@nestjs/common';
import { FindAllBrsDiffusionWebsitesParams } from './findAll.params';
import { Pagination } from 'src/application/common/pagination';
import { BrsDiffusionWebsiteRepositoryInterface } from 'src/domain/brs-diffusion-website/brs-diffusion-website.repository.interface';
import { BrsDiffusionWebsiteView } from '../views/brs-diffusion-website.view';
import { BrsDiffusionWebsiteEntityWithDistance } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.entity';

export const DEFAULT_RADIUS = 50;

export class FindAllBrsDiffusionWebsitesUsecase {
  constructor(
    @Inject('BrsDiffusionWebsiteRepositoryInterface')
    private readonly brsDiffusionWebsiteRepository: BrsDiffusionWebsiteRepositoryInterface,
  ) {}

  public async execute(
    params: FindAllBrsDiffusionWebsitesParams,
  ): Promise<Pagination<BrsDiffusionWebsiteView>> {
    const {
      page,
      pageSize,
      latitude,
      longitude,
      radius = DEFAULT_RADIUS,
    } = params;
    const paginationProps = { page, pageSize };

    let brsDiffusionWebsites;
    let totalCount: number;
    let showDistance = false;

    if (latitude && longitude && radius) {
      [brsDiffusionWebsites, totalCount] =
        await this.brsDiffusionWebsiteRepository.findAllByLocation(
          paginationProps,
          latitude,
          longitude,
          radius,
        );

      showDistance = true;
    } else {
      [brsDiffusionWebsites, totalCount] =
        await this.brsDiffusionWebsiteRepository.findAll(paginationProps);
    }

    const items = brsDiffusionWebsites.map((brsDiffusionWebsite) => {
      return new BrsDiffusionWebsiteView(
        brsDiffusionWebsite.id,
        brsDiffusionWebsite.source,
        brsDiffusionWebsite.distributorName,
        brsDiffusionWebsite.ofsName,
        brsDiffusionWebsite.city,
        brsDiffusionWebsite.zipcode,
        brsDiffusionWebsite.address,
        brsDiffusionWebsite.inseeCode,
        brsDiffusionWebsite.latitude,
        brsDiffusionWebsite.longitude,
        {
          id: brsDiffusionWebsite.region.id,
          name: brsDiffusionWebsite.region.name,
        },
        {
          id: brsDiffusionWebsite.departement.id,
          name: brsDiffusionWebsite.departement.name,

          code: brsDiffusionWebsite.departement.code,
        },
        showDistance
          ? (brsDiffusionWebsite as BrsDiffusionWebsiteEntityWithDistance)
              .distance
          : undefined,
      );
    });

    return new Pagination(items, totalCount, { page, pageSize });
  }
}
