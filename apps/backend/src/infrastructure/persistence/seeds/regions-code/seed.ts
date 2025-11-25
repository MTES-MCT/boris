import { Injectable } from '@nestjs/common';
import { inseeRegions } from './data';
import { FindAllRegionsUsecase } from 'src/application/region/usecases/findAll.usecase';
import { UpdateRegionUsecase } from 'src/application/region/usecases/update.usecase';

@Injectable()
export class RegionsCodeSeed {
  constructor(
    private readonly findAllRegionsUsecase: FindAllRegionsUsecase,
    private readonly updateRegionUsecase: UpdateRegionUsecase,
  ) {}

  async seed() {
    const { items } = await this.findAllRegionsUsecase.execute({
      page: 1,
      pageSize: 100,
    });

    for (const region of items) {
      const inseeRegion = inseeRegions.find((r) => r.LIBELLE === region.name);

      if (inseeRegion) {
        await this.updateRegionUsecase.execute({
          name: region.name,
          code: inseeRegion.REG,
        });
      }
    }

    console.log('Les codes des régions ont bien été ajoutés.');
  }
}
