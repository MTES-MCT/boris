import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { OfsRepositoryInterface } from 'src/domain/ofs/ofs.repository.interface';
import { RegionRepositoryInterface } from 'src/domain/region/region.repository.interface';
import { DistributorRepositoryInterface } from 'src/domain/distributor/distributor.repository.interface';
import { RegionEntity } from 'src/infrastructure/region/region.entity';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';
import { OfsView } from '../views/ofs.view';
import { UpdateOfsUsecaseParams } from './update.params';

export class UpdateOfsUsecase {
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

  public async execute(params: UpdateOfsUsecaseParams): Promise<OfsView> {
    const {
      id,
      name,
      phone,
      websiteUrl,
      email,
      producesBrs,
      regionNames,
      departementNames,
      distributorIds,
    } = params;

    const ofs = await this.ofsRepository.findById(id);

    if (!ofs) {
      throw new NotFoundException();
    }

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

    ofs.name = name;
    ofs.phone = phone || null;
    ofs.websiteUrl = websiteUrl || null;
    ofs.email = email || null;
    ofs.producesBrs = producesBrs || false;
    ofs.departements = existingDepartements;
    ofs.regions = existingRegions;
    ofs.distributors = existingDistributors;

    const updatedOfs = await this.ofsRepository.save(ofs);

    return new OfsView(
      updatedOfs.id,
      updatedOfs.name,
      updatedOfs.websiteUrl,
      updatedOfs.phone,
      updatedOfs.email,
      updatedOfs.producesBrs,
      updatedOfs.departements.map((d) => ({
        id: d.id,
        name: d.name,
        code: d.code,
      })),
      updatedOfs.regions.map((r) => ({ id: r.id, name: r.name })),
      updatedOfs.distributors.map((d) => ({ id: d.id, name: d.name })),
    );
  }
}
