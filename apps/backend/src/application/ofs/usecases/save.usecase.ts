import { BadRequestException, Inject } from '@nestjs/common';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { OfsRepositoryInterface } from 'src/domain/ofs/ofs.repository.interface';
import { RegionRepositoryInterface } from 'src/domain/region/region.repository.interface';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { SaveOfsParams } from './save.params';
import { DistributorRepositoryInterface } from 'src/domain/distributor/distributor.repository.interface';
import { RegionEntity } from 'src/infrastructure/region/region.entity';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';

export class SaveOfsUsecase {
  constructor(
    @Inject('OfsRepositoryInterface')
    private readonly ofsRepository: OfsRepositoryInterface,
    @Inject('RegionRepositoryInterface')
    private readonly regionRepository: RegionRepositoryInterface,
    @Inject('DepartementRepositoryInterface')
    private readonly departementRepository: DepartementRepositoryInterface,
    @Inject('DistributorRepositoryInterface')
    private readonly distributorRepository: DistributorRepositoryInterface,
  ) {}

  public async execute(ofs: SaveOfsParams): Promise<OfsEntity> {
    const { regions, departements, distributors } = ofs;
    let existingRegions: RegionEntity[] = [];
    let existingDepartements: DepartementEntity[] = [];
    let existingDistributors: DistributorEntity[] = [];

    if (regions) {
      existingRegions = await this.regionRepository.findManyByNames(
        regions?.map((r) => r) || [],
      );

      if (existingRegions.length !== regions?.length) {
        throw new BadRequestException();
      }
    }

    if (departements) {
      existingDepartements = await this.departementRepository.findManyByNames(
        departements?.map((d) => d) || [],
      );

      if (existingDepartements.length !== departements?.length) {
        throw new BadRequestException();
      }
    }

    if (distributors) {
      existingDistributors = await this.distributorRepository.findManyByIds(
        distributors?.map((d) => d) || [],
      );

      if (existingDistributors.length !== distributors?.length) {
        throw new BadRequestException();
      }
    }

    const ofsEntity = new OfsEntity(
      ofs.name,
      ofs.phone,
      ofs.websiteUrl,
      ofs.email,
      existingDepartements,
      existingRegions,
      existingDistributors,
    );

    return await this.ofsRepository.save(ofsEntity);
  }
}
