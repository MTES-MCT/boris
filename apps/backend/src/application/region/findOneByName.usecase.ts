import { Inject, NotFoundException } from '@nestjs/common';
import { RegionRepositoryInterface } from 'src/domain/region/region.repository.interface';
import { RegionEntity } from 'src/infrastructure/region/region.entity';

export class FindOneRegionByNameUsecase {
  constructor(
    @Inject('RegionRepositoryInterface')
    private readonly regionRepository: RegionRepositoryInterface,
  ) {}

  public async execute(name: string): Promise<RegionEntity> {
    const region = await this.regionRepository.findOneByName(name);

    if (!region) {
      throw new NotFoundException();
    }

    return region;
  }
}
