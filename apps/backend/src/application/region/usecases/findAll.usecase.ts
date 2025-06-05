import { Inject } from '@nestjs/common';
import { RegionRepositoryInterface } from 'src/domain/region/region.repository.interface';
import { FindAllRegionsParams } from './findAll.params';
import { RegionView } from '../views/region.view';
import { Pagination } from 'src/application/pagination/pagination';

export class FindAllRegionsUsecase {
  constructor(
    @Inject('RegionRepositoryInterface')
    private readonly regionRepository: RegionRepositoryInterface,
  ) {}

  public async execute(
    params: FindAllRegionsParams,
  ): Promise<Pagination<RegionView>> {
    const { paginationProps } = params;

    const [regions, totalCount] = await this.regionRepository.findAll({
      ...paginationProps,
    });

    const items = regions.map((region) => {
      return new RegionView(region.id, region.name);
    });

    return new Pagination(items, totalCount, paginationProps);
  }
}
