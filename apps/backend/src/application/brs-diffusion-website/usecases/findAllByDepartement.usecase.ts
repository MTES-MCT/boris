import { Inject } from '@nestjs/common';
import { Pagination } from 'src/application/common/pagination';
import { BrsDiffusionWebsiteRepositoryInterface } from 'src/domain/brs-diffusion-website/brs-diffusion-website.repository.interface';
import { BrsDiffusionWebsiteView } from '../views/brs-diffusion-website.view';
import { FindAllBrsDiffusionWebsitesByDepartementParams } from './findAllByDepartement.params';

export const DEFAULT_RADIUS = 100;

export class FindAllBrsDiffusionWebsitesByDepartementUsecase {
  constructor(
    @Inject('BrsDiffusionWebsiteRepositoryInterface')
    private readonly brsDiffusionWebsiteRepository: BrsDiffusionWebsiteRepositoryInterface,
  ) {}

  public async execute(
    params: FindAllBrsDiffusionWebsitesByDepartementParams,
  ): Promise<Pagination<BrsDiffusionWebsiteView>> {
    const { page, pageSize, departementId } = params;
    const paginationProps = { page, pageSize };

    const [brsDiffusionWebsites, totalCount] =
      await this.brsDiffusionWebsiteRepository.findAllByDepartement(
        paginationProps,
        departementId,
      );

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
      );
    });

    return new Pagination(items, totalCount, { page, pageSize });
  }
}
