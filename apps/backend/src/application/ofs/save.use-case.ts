import { BadRequestException, Inject } from '@nestjs/common';
import { OfsRepositoryInterface } from 'src/domain/ofs/ofs.repository.interface';
import { RegionRepositoryInterface } from 'src/domain/region/region.repository.interface';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';

export class SaveOfsUsecase {
  constructor(
    @Inject('OfsRepositoryInterface')
    private readonly ofsRepository: OfsRepositoryInterface,
    @Inject('RegionRepositoryInterface')
    private readonly regionRepository: RegionRepositoryInterface,
  ) {}

  public async execute(ofs: OfsEntity): Promise<OfsEntity> {
    // TODO - Checker si le nomn de l'OFS existe déjà
    // TODO - Checker l'existence des départements
    const { regions } = ofs;

    const existingRegions = await this.regionRepository.findManyByNames(
      regions?.map((r) => r.name) || [],
    );

    if (existingRegions.length !== regions?.length) {
      throw new BadRequestException();
    }

    return await this.ofsRepository.save(ofs);
  }
}
