import { Inject } from '@nestjs/common';
import { RegionRepositoryInterface } from 'src/domain/region/region.repository.interface';
import { RegionEntity } from 'src/infrastructure/region/region.entity';

export class FindAllRegionsUsecase {
  constructor(
    @Inject('RegionRepositoryInterface')
    private readonly regionRepository: RegionRepositoryInterface,
  ) {}

  public async execute(): Promise<RegionEntity[]> {
    return this.regionRepository.findAll();
  }
}
