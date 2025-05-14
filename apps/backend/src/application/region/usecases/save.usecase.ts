import { ConflictException, Inject } from '@nestjs/common';
import { RegionInterface } from 'src/domain/region/region.interface';
import { RegionRepositoryInterface } from 'src/domain/region/region.repository.interface';
import { RegionEntity } from 'src/infrastructure/region/region.entity';

export class SaveRegionUsecase {
  constructor(
    @Inject('RegionRepositoryInterface')
    private readonly regionRepository: RegionRepositoryInterface,
  ) {}

  public async execute(region: RegionInterface): Promise<RegionEntity> {
    const existingRegion = await this.regionRepository.findOneByName(
      region.name,
    );

    if (existingRegion) {
      throw new ConflictException();
    }

    return await this.regionRepository.save(region);
  }
}
