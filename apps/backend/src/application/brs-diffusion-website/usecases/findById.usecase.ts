import { FindBrsDiffusionWebsiteByIdParams } from './findById.params';
import { Inject, NotFoundException } from '@nestjs/common';
import { BrsDiffusionWebsiteRepositoryInterface } from 'src/domain/brs-diffusion-website/brs-diffusion-website.repository.interface';
import { BrsDiffusionWebsiteView } from '../views/brs-diffusion-website.view';

export class FindBrsDiffusionWebsiteByIdUsecase {
  constructor(
    @Inject('BrsDiffusionWebsiteRepositoryInterface')
    private readonly brsDiffusionWebsiteRepository: BrsDiffusionWebsiteRepositoryInterface,
  ) {}

  public async execute(
    params: FindBrsDiffusionWebsiteByIdParams,
  ): Promise<BrsDiffusionWebsiteView> {
    const { id } = params;

    const brsDiffusionWebsite =
      await this.brsDiffusionWebsiteRepository.findById(id);

    if (!brsDiffusionWebsite) {
      throw new NotFoundException();
    }

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
  }
}
