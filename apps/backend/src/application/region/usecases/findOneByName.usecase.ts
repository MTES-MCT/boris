import { Inject, NotFoundException } from '@nestjs/common';
import { RegionRepositoryInterface } from 'src/domain/region/region.repository.interface';
import { FindOneRegionByNameParams } from './findOneByName.params';
import { RegionView } from '../views/region.view';

export class FindOneRegionByNameUsecase {
  constructor(
    @Inject('RegionRepositoryInterface')
    private readonly regionRepository: RegionRepositoryInterface,
  ) {}

  public async execute(params: FindOneRegionByNameParams): Promise<RegionView> {
    const { name } = params;

    const region = await this.regionRepository.findOneByName(name);

    if (!region) {
      throw new NotFoundException();
    }

    return new RegionView(region.id, region.name);
  }
}
