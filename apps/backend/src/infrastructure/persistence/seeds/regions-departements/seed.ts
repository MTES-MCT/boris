import { Injectable } from '@nestjs/common';
import { SaveDepartementUsecase } from 'src/application/departement/usecases/save.usecase';
import { SaveRegionUsecase } from 'src/application/region/usecases/save.usecase';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { RegionEntity } from 'src/infrastructure/region/region.entity';
import { regions } from './data';

@Injectable()
export class RegionsDepartementsSeed {
  constructor(
    private readonly saveRegionUsecase: SaveRegionUsecase,
    private readonly saveDepartementUsecase: SaveDepartementUsecase,
  ) {}

  async seed() {
    let regionsCount = 0;
    let departementsCount = 0;

    const promises: Promise<DepartementEntity>[] = [];

    for (const region of regions) {
      const newRegion = await this.saveRegionUsecase.execute(
        new RegionEntity(region.name, []),
      );

      regionsCount = regionsCount + 1;

      for (const departement of region.departements) {
        await this.saveDepartementUsecase.execute({
          name: departement.name,
          code: departement.code,
          regionName: newRegion.name,
        });

        departementsCount = departementsCount + 1;
      }
    }

    await Promise.all(promises);

    console.log(`${regionsCount} regions créées.`);
    console.log(`${departementsCount} départements créés.`);
  }
}
