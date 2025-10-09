import { Inject, NotFoundException } from '@nestjs/common';
import { FindOneMunicipalityByInseeCodeParams } from './findOneByInseeCode.params';
import { MunicipalityRepositoryInterface } from 'src/domain/municipality/municipality.repository.interface';
import { MunicipalityView } from '../views/municipality.view';
import { BrsZone } from 'src/domain/brs-zone/brz-zone.type';

export class FindOneMunicipalityByInseeCodeUsecase {
  constructor(
    @Inject('MunicipalityRepositoryInterface')
    private readonly municipalityRepository: MunicipalityRepositoryInterface,
  ) {}

  public async execute(
    params: FindOneMunicipalityByInseeCodeParams,
  ): Promise<MunicipalityView> {
    const { inseeCode } = params;

    let municipality =
      await this.municipalityRepository.findOneByInseeCode(inseeCode);

    if (!municipality) {
      if (inseeCode.startsWith('75')) {
        municipality =
          await this.municipalityRepository.findOneByInseeCode('75056');
      } else if (inseeCode.startsWith('69')) {
        municipality =
          await this.municipalityRepository.findOneByInseeCode('69123');
      } else if (inseeCode.startsWith('13')) {
        municipality =
          await this.municipalityRepository.findOneByInseeCode('13055');
      } else {
        throw new NotFoundException();
      }
    }

    return new MunicipalityView(
      municipality?.id as string,
      municipality?.name as string,
      municipality?.inseeCode as string,
      municipality?.zone as BrsZone,
      {
        id: municipality?.departement.id as string,
        name: municipality?.departement.name as string,
        code: municipality?.departement.code as string,
      },
    );
  }
}
