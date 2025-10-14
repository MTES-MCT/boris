import { BadRequestException, Inject } from '@nestjs/common';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { OfsRepositoryInterface } from 'src/domain/ofs/ofs.repository.interface';
import { RegionRepositoryInterface } from 'src/domain/region/region.repository.interface';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { CreateOfsUsecaseParams } from './create.params';
import { DistributorRepositoryInterface } from 'src/domain/distributor/distributor.repository.interface';
import { RegionEntity } from 'src/infrastructure/region/region.entity';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';
import { OfsView } from '../views/ofs.view';

export class CreateOfsUsecase {
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

  public async execute(params: CreateOfsUsecaseParams): Promise<OfsView> {
    const {
      name,
      phone,
      websiteUrl,
      email,
      producesBrs,
      regionNames,
      departementNames,
      distributorIds,
    } = params;

    let existingRegions: RegionEntity[] = [];
    let existingDepartements: DepartementEntity[] = [];
    let existingDistributors: DistributorEntity[] = [];

    if (regionNames) {
      existingRegions = await this.regionRepository.findManyByNames(
        regionNames?.map((r) => r) || [],
      );

      if (existingRegions.length !== regionNames?.length) {
        throw new BadRequestException();
      }
    }

    if (departementNames) {
      existingDepartements = await this.departementRepository.findManyByNames(
        departementNames?.map((d) => d) || [],
      );

      if (existingDepartements.length !== departementNames?.length) {
        throw new BadRequestException();
      }
    }

    if (distributorIds) {
      existingDistributors = await this.distributorRepository.findManyByIds(
        distributorIds?.map((d) => d) || [],
      );

      if (existingDistributors.length !== distributorIds?.length) {
        throw new BadRequestException();
      }
    }

    const createdOfs = await this.ofsRepository.save(
      new OfsEntity(
        name,
        phone || null,
        websiteUrl || null,
        email || null,
        producesBrs || false,
        existingDepartements,
        existingRegions,
        existingDistributors,
      ),
    );

    return new OfsView(
      createdOfs.id,
      createdOfs.name,
      createdOfs.websiteUrl,
      createdOfs.phone,
      createdOfs.email,
      createdOfs.producesBrs,
      createdOfs.departements.map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
      })),
      createdOfs.regions.map((r) => ({ id: r.id, name: r.name })),
      createdOfs.distributors.map((d) => ({ id: d.id, name: d.name })),
    );
  }
}
