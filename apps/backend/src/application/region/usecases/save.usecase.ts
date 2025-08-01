import { ConflictException, Inject } from '@nestjs/common';
import { RegionRepositoryInterface } from 'src/domain/region/region.repository.interface';
import { RegionView } from '../views/region.view';
import { SaveRegionParams } from './save.params';
import { RegionEntity } from 'src/infrastructure/region/region.entity';

export class SaveRegionUsecase {
  constructor(
    @Inject('RegionRepositoryInterface')
    private readonly regionRepository: RegionRepositoryInterface,
  ) {}

  public async execute(params: SaveRegionParams): Promise<RegionView> {
    const { name } = params;

    const existingRegion = await this.regionRepository.findOneByName(name);

    if (existingRegion) {
      throw new ConflictException();
    }

    const region = await this.regionRepository.save(new RegionEntity(name, []));

    return new RegionView(region.id, region.name);
  }
}
