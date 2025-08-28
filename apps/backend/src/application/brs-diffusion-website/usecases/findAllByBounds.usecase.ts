import { Inject } from "@nestjs/common";
import { BrsDiffusionWebsiteRepositoryInterface } from "src/domain/brs-diffusion-website/brs-diffusion-website.repository.interface";
import { FindAllBrsDiffusionWebsitesByBoundsParams } from "./findAllByBounds.params";
import { BrsDiffusionWebsiteView } from "../views/brs-diffusion-website.view";
import { Pagination } from "src/application/common/pagination";

export class FindAllBrsDiffusionWebsitesByBoundsUsecase {
  constructor(
    @Inject('BrsDiffusionWebsiteRepositoryInterface')
    private readonly brsDiffusionWebsiteRepository: BrsDiffusionWebsiteRepositoryInterface,
  ) { }

  public async execute(params: FindAllBrsDiffusionWebsitesByBoundsParams) {
    const {
      page,
      pageSize,
      northEastLat,
      northEastLng,
      southWestLat,
      southWestLng
    } = params

    const paginationProps = { page, pageSize };

    const [brsDiffusionWebsites, totalCount] = await this.brsDiffusionWebsiteRepository.findAllByBounds(
      paginationProps,
      northEastLat,
      northEastLng,
      southWestLat,
      southWestLng
    )

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