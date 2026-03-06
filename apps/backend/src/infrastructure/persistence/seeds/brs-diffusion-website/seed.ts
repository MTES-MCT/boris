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
    let skipped = 0;

    for (const brsDiffusionWebsite of brsDiffusionWebsites) {
      try {
        await this.createBrsDiffusionWebsiteUsecase.execute({
          source: brsDiffusionWebsite.source,
          distributorName: brsDiffusionWebsite.commercialisateur,
          ofsName: brsDiffusionWebsite.ofs,
          city: brsDiffusionWebsite.commune,
          inseeCode: brsDiffusionWebsite.codeInsee,
        });

        count++;
        console.log(
          `${count + skipped}/${brsDiffusionWebsites.length} - ${brsDiffusionWebsite.commune}`,
        );
      } catch (error) {
        skipped++;
        console.warn(
          `Ignoré: ${brsDiffusionWebsite.commune} (${brsDiffusionWebsite.codeInsee}) - ${error instanceof Error ? error.message : error}`,
        );
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log(`${count} sites de diffusion BRS créés, ${skipped} ignorés`);
  }
}
