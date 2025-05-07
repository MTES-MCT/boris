import { Injectable } from '@nestjs/common';
import { FindManyDepartementsByNamesUsecase } from 'src/application/departement/findManyByNames.usecase';

@Injectable()
export class OfsSeed {
  constructor(
    private readonly findManyDepartementsByNamesUsecase: FindManyDepartementsByNamesUsecase,
  ) {}

  async seed() {
    const departements = await this.findManyDepartementsByNamesUsecase.execute([
      "Côtes-d'Armor",
      'Finistère',
    ]);

    console.log(departements);
  }
}
