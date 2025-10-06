import { Injectable } from '@nestjs/common';
import { municipalities } from './data';
import { CreateMunicipalityUsecase } from 'src/application/municipality/usecases/create.usecase';

@Injectable()
export class MunicipalitySeed {
  constructor(
    private readonly createMunicipalityUsecase: CreateMunicipalityUsecase,
  ) {}

  async seed() {
    let count = 0;

    for (const municipality of municipalities) {
      await this.createMunicipalityUsecase.execute({
        name: municipality.name,
        inseeCode: municipality.inseeCode,
        zone: municipality.zone,
      });

      count++;

      console.log(`${count}/${municipalities.length} - ${municipality.name}`);
    }

    console.log(`${count} communes créées`);
  }
}
