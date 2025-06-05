import { BadRequestException, ConflictException, Inject } from '@nestjs/common';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { SaveDepartementParams } from './save.params';
import { DepartementView } from '../views/departement.view';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { RegionRepositoryInterface } from 'src/domain/region/region.repository.interface';

export class SaveDepartementUsecase {
  constructor(
    @Inject('DepartementRepositoryInterface')
    private readonly departementRepository: DepartementRepositoryInterface,
    @Inject('RegionRepositoryInterface')
    private readonly regionRepository: RegionRepositoryInterface,
  ) {}

  public async execute(
    params: SaveDepartementParams,
  ): Promise<DepartementView> {
    const { name, code, regionName } = params;

    let existingDepartement =
      await this.departementRepository.findOneByName(name);

    if (existingDepartement) {
      throw new ConflictException();
    }

    existingDepartement = await this.departementRepository.findOneByCode(code);

    if (existingDepartement) {
      throw new ConflictException();
    }

    const region = await this.regionRepository.findOneByName(regionName);

    if (!region) {
      throw new BadRequestException();
    }

    const departement = await this.departementRepository.save(
      new DepartementEntity(name, code, region),
    );

    return new DepartementView(
      departement.id,
      departement.name,
      departement.code,
    );
  }
}
