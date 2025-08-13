import { Injectable } from '@nestjs/common';
import { brsDiffusionWebsites } from './data';
import { CreateBrsDiffusionWebsiteUsecase } from 'src/application/brs-diffusion-website/usecases/create.usecase';

@Injectable()
export class BrsDiffusionWebsiteSeed {
  constructor(
    private readonly createBrsDiffusionWebsiteUsecase: CreateBrsDiffusionWebsiteUsecase,
  ) {}

  async seed() {
    let count = 0;

    for (const brsDiffusionWebsite of brsDiffusionWebsites) {
      await this.createBrsDiffusionWebsiteUsecase.execute({
        source: brsDiffusionWebsite.source,
        distributorName: brsDiffusionWebsite.commercialisateur,
        ofsName: brsDiffusionWebsite.ofs,
        city: brsDiffusionWebsite.commune,
        inseeCode: brsDiffusionWebsite.inseeCode,
      });

      count++;

      console.log(`${count}/${brsDiffusionWebsites.length}`);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    console.log(`${count} sites de diffusion BRS créés`);
  }
}
