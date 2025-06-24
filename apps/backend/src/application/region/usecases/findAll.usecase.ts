import { Inject } from '@nestjs/common';
import { RegionRepositoryInterface } from 'src/domain/region/region.repository.interface';
import { FindAllRegionsParams } from './findAll.params';
import { RegionView } from '../views/region.view';
import { Pagination } from 'src/application/common/pagination';

export class FindAllRegionsUsecase {
  constructor(
    @Inject('RegionRepositoryInterface')
    private readonly regionRepository: RegionRepositoryInterface,
  ) {}

  public async execute(
    params: FindAllRegionsParams,
  ): Promise<Pagination<RegionView>> {
    const { page, pageSize } = params;

    const [regions, totalCount] = await this.regionRepository.findAll({
      page,
      pageSize,
    });

    const items = regions.map((region) => {
      return new RegionView(region.id, region.name);
    });

    return new Pagination(items, totalCount, { page, pageSize });
  }
}
