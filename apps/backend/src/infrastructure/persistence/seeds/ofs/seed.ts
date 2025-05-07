import fs from 'fs';
import { parse } from 'csv-parse';
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

    // fs.readFile('ofs.csv', (err, data) => {
    //   if (err) throw err;

    //   parse(data, { columns: true }, (err, records) => {
    //     if (err) throw err;

    //     // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    //     records.forEach((row: any) => {
    //       console.log('Ligne :', row); // Traitement de chaque ligne ici
    //     });
    //   });
    // });
  }
}
