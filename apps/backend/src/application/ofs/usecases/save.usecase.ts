import { BadRequestException, Inject } from '@nestjs/common';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { OfsRepositoryInterface } from 'src/domain/ofs/ofs.repository.interface';
import { RegionRepositoryInterface } from 'src/domain/region/region.repository.interface';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';

export class SaveOfsUsecase {
  constructor(
    @Inject('OfsRepositoryInterface')
    private readonly ofsRepository: OfsRepositoryInterface,
    @Inject('RegionRepositoryInterface')
    private readonly regionRepository: RegionRepositoryInterface,
    @Inject('DepartementRepositoryInterface')
    private readonly departementRepository: DepartementRepositoryInterface,
  ) {}

  public async execute(ofs: OfsEntity): Promise<OfsEntity> {
    const { regions, departements } = ofs;

    const existingRegions = await this.regionRepository.findManyByNames(
      regions?.map((r) => r.name),
    );

    if (existingRegions.length !== regions?.length) {
      throw new BadRequestException();
    }

    const existingDepartements =
      await this.departementRepository.findManyByNames(
        departements?.map((r) => r.name),
      );

    if (existingDepartements.length !== departements?.length) {
      throw new BadRequestException();
    }

    return await this.ofsRepository.save(ofs);
  }
}
