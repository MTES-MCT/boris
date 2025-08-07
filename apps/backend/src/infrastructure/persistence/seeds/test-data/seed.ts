import { Injectable } from '@nestjs/common';
import { SaveDepartementUsecase } from 'src/application/departement/usecases/save.usecase';
import { SaveRegionUsecase } from 'src/application/region/usecases/save.usecase';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { setDistributors } from '../ofs/seed';
import { FindManyDepartementsByNamesUsecase } from 'src/application/departement/usecases/findManyByNames.usecase';
import { FindOneRegionByNameUsecase } from 'src/application/region/usecases/findOneByName.usecase';
import { CreateDistributorUsecase } from 'src/application/distributor/usecases/create.usecase';
import { CreateOfsUsecase } from 'src/application/ofs/usecases/create.usecase';
import { regions } from '../regions-departements/data';
import { ofss } from '../ofs/data';
import { brsDiffusionWebsites } from '../brs-diffusion-website/data';
import { CreateBrsDiffusionWebsiteUsecase } from 'src/application/brs-diffusion-website/usecases/create.usecase';

@Injectable()
export class TestDataSeed {
  constructor(
    private readonly saveRegionUsecase: SaveRegionUsecase,
    private readonly saveDepartementUsecase: SaveDepartementUsecase,
    private readonly findManyDepartementsByNamesUsecase: FindManyDepartementsByNamesUsecase,
    private readonly findOneRegionByNameUsecase: FindOneRegionByNameUsecase,
    private readonly createDistributorUsecase: CreateDistributorUsecase,
    private readonly createOfsUsecase: CreateOfsUsecase,
    private readonly createBrsDiffusionWebsiteUsecase: CreateBrsDiffusionWebsiteUsecase,
  ) {}

  private async seedRegions() {
    console.log('Création des régions et départements');

    let regionsCount = 0;
    let departementsCount = 0;

    const promises: Promise<DepartementEntity>[] = [];

    for (const region of regions) {
      const newRegion = await this.saveRegionUsecase.execute({
        name: region.name,
      });

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

  private async seedOfss() {
    console.log('Création des ofss et commercialisateurs');

    let ofsCount = 0;
    let distributorCount = 0;

    for (const ofs of ofss) {
      const region = await this.findOneRegionByNameUsecase.execute({
        name: ofs.region,
      });

      const departements =
        await this.findManyDepartementsByNamesUsecase.execute({
          names: ofs.departements?.split(', ') || [],
        });

      const distributorIds: string[] = [];
      let ofsWebsiteUrl = ofs.lien;

      if (ofs.commercialisateur) {
        for (const distributor of setDistributors(ofs)) {
          const newDistributor =
            await this.createDistributorUsecase.execute(distributor);

          distributorIds.push(newDistributor.id);
          distributorCount = distributorCount + 1;
        }

        ofsWebsiteUrl = null;
      }

      await this.createOfsUsecase.execute({
        name: ofs.nom,
        phone: ofs.telephone || undefined,
        websiteUrl: ofsWebsiteUrl || undefined,
        email: ofs.email || undefined,
        departementNames: departements.map((d) => d.name),
        regionNames: [region.name],
        distributorIds,
      });
      ofsCount = ofsCount + 1;
    }

    console.log(`${ofsCount} ofss créés.`);
    console.log(`${distributorCount} commercialisateurs créés.`);
  }

  private async seedBrsDiffusionWebsites() {
    console.log('Création des sites web de diffusion BRS');

    let brsDiffusionWebsitesCount = 0;

    for (const brsDiffusionWebsite of brsDiffusionWebsites) {
      await this.createBrsDiffusionWebsiteUsecase.execute({
        source: brsDiffusionWebsite.source,
        ofsName: brsDiffusionWebsite.ofs,
        distributorName: brsDiffusionWebsite.commercialisateur,
        city: brsDiffusionWebsite.commune,
      });

      brsDiffusionWebsitesCount = brsDiffusionWebsitesCount + 1;
    }

    console.log(
      `${brsDiffusionWebsitesCount} sites web de diffusion BRS créés.`,
    );
  }

  async seed() {
    await this.seedRegions();
    await this.seedOfss();
    await this.seedBrsDiffusionWebsites();
  }
}
