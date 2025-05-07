import { Injectable } from '@nestjs/common';
import { FindManyDepartementsByNamesUsecase } from 'src/application/departement/findManyByNames.usecase';
import { FindOneRegionByNameUsecase } from 'src/application/region/findOneByName.usecase';

@Injectable()
export class OfsSeed {
  constructor(
    private readonly findManyDepartementsByNamesUsecase: FindManyDepartementsByNamesUsecase,
    private readonly findOneRegionByNameUsecase: FindOneRegionByNameUsecase,
  ) {}

  async seed() {
    const departements = await this.findManyDepartementsByNamesUsecase.execute([
      "Côtes-d'Armor",
      'Finistère',
    ]);

    console.log(departements);

    const region = await this.findOneRegionByNameUsecase.execute('Bretagne');

    console.log(region);
  }
}
