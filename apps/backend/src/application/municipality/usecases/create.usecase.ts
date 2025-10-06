import { Inject, NotFoundException } from '@nestjs/common';
import { MunicipalityRepositoryInterface } from 'src/domain/municipality/municipality.repository.interface';
import { MunicipalityView } from '../views/municipality.view';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { CreateMunicipalityParams } from './create.params';
import { MunicipalityEntity } from 'src/infrastructure/municipality/municipality.entity';

export class CreateMunicipalityUsecase {
  constructor(
    @Inject('MunicipalityRepositoryInterface')
    private readonly municipalityRepository: MunicipalityRepositoryInterface,
    @Inject('DepartementRepositoryInterface')
    private readonly departementRepository: DepartementRepositoryInterface,
  ) {}

  public async execute(
    params: CreateMunicipalityParams,
  ): Promise<MunicipalityView> {
    const { name, inseeCode, zone } = params;

    const departement =
      await this.departementRepository.findOneByInseeCode(inseeCode);

    if (!departement) {
      throw new NotFoundException('Departement not found');
    }

    const municipality = await this.municipalityRepository.save(
      new MunicipalityEntity(name, inseeCode, zone, departement),
    );

    return new MunicipalityView(
      municipality.id,
      municipality.name,
      municipality.inseeCode,
      municipality.zone,
      {
        id: municipality.departement.id,
        name: municipality.departement.name,
        code: municipality.departement.code,
      },
    );
  }
}
