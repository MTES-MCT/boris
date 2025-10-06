import { Inject, NotFoundException } from '@nestjs/common';
import { FindOneMunicipalityByInseeCodeParams } from './findOneByInseeCode.params';
import { MunicipalityRepositoryInterface } from 'src/domain/municipality/municipality.repository.interface';
import { MunicipalityView } from '../views/municipality.view';

export class FindOneMunicipalityByInseeCodeUsecase {
  constructor(
    @Inject('MunicipalityRepositoryInterface')
    private readonly municipalityRepository: MunicipalityRepositoryInterface,
  ) {}

  public async execute(
    params: FindOneMunicipalityByInseeCodeParams,
  ): Promise<MunicipalityView> {
    const { inseeCode } = params;

    const municipality =
      await this.municipalityRepository.findOneByInseeCode(inseeCode);

    if (!municipality) {
      throw new NotFoundException();
    }

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
