import { Inject, NotFoundException } from '@nestjs/common';
import { RegionRepositoryInterface } from 'src/domain/region/region.repository.interface';
import { UpdateRegionParams } from './udpate.params';
import { RegionView } from '../views/region.view';
import { RegionCode } from 'src/domain/region/region.interface';

export class UpdateRegionUsecase {
  constructor(
    @Inject('RegionRepositoryInterface')
    private readonly regionRepository: RegionRepositoryInterface,
  ) {}

  public async execute(params: UpdateRegionParams): Promise<RegionView> {
    const { name, code } = params;

    const region = await this.regionRepository.findOneByName(name);

    if (!region) {
      throw new NotFoundException('Region not found');
    }

    region.code = code as RegionCode;

    const updatedRegion = await this.regionRepository.save(region);

    return new RegionView(updatedRegion.id, updatedRegion.name);
  }
}
