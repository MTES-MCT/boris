import { Injectable } from '@nestjs/common';
import { SaveDepartementUsecase } from 'src/application/departement/usecases/save.usecase';
import { SaveRegionUsecase } from 'src/application/region/usecases/save.usecase';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { RegionEntity } from 'src/infrastructure/region/region.entity';
import { Ofs, setDistributors } from '../ofs/seed';
import { FindManyDepartementsByNamesUsecase } from 'src/application/departement/usecases/findManyByNames.usecase';
import { FindOneRegionByNameUsecase } from 'src/application/region/usecases/findOneByName.usecase';
import { SaveDistributorUsecase } from 'src/application/distributor/usecases/save.usecase';
import { SaveOfsUsecase } from 'src/application/ofs/usecases/save.usecase';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';

const regions = [
  {
    name: 'Bretagne',
    departements: [
      { name: "Côtes-d'Armor", code: '22' },
      { name: 'Finistère', code: '29' },
      { name: 'Ille-et-Vilaine', code: '35' },
      { name: 'Morbihan', code: '56' },
    ],
  },
];

const ofss: Ofs[] = [
  {
    nom: 'La Coop Foncière Bretonne ',
    commercialisateur: 'Maison Familiale de Quimper, Grand Delta Habitat',
    region: 'Bretagne',
    departements: 'Finistère',
    lien: 'https://maison-familiale-de-quimper.fr/, https://www.granddelta.fr/',
    telephone: null,
    email: null,
  },
  {
    nom: 'Archipel Habitat',
    commercialisateur: null,
    region: 'Bretagne',
    departements: 'Ille-et-Vilaine',
    lien: 'https://www.archipel-habitat.fr/trouver-un-logement/acheter-un-logement/programmes-en-cours',
    telephone: null,
    email: null,
  },
];

@Injectable()
export class TestDataSeed {
  constructor(
    private readonly saveRegionUsecase: SaveRegionUsecase,
    private readonly saveDepartementUsecase: SaveDepartementUsecase,
    private readonly findManyDepartementsByNamesUsecase: FindManyDepartementsByNamesUsecase,
    private readonly findOneRegionByNameUsecase: FindOneRegionByNameUsecase,
    private readonly saveDistributorUsecase: SaveDistributorUsecase,
    private readonly saveOfsUsecase: SaveOfsUsecase,
  ) {}

  private async seedRegions() {
    console.log('Création des régions et départements');

    let regionsCount = 0;
    let departementsCount = 0;

    const promises: Promise<DepartementEntity>[] = [];

    for (const region of regions) {
      const newRegion = await this.saveRegionUsecase.execute(
        new RegionEntity(region.name, []),
      );

      regionsCount = regionsCount + 1;

      for (const departement of region.departements) {
        await this.saveDepartementUsecase.execute(
          new DepartementEntity(departement.name, departement.code, newRegion),
        );

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
      const region = await this.findOneRegionByNameUsecase.execute(ofs.region);

      const departements =
        await this.findManyDepartementsByNamesUsecase.execute(
          ofs.departements?.split(', ') || [],
        );

      const distributors: DistributorEntity[] = [];
      let ofsWebsiteUrl = ofs.lien;

      if (ofs.commercialisateur) {
        for (const distributor of setDistributors(ofs)) {
          const newDistributor =
            await this.saveDistributorUsecase.execute(distributor);

          distributors.push(newDistributor);
          distributorCount = distributorCount + 1;
        }

        ofsWebsiteUrl = null;
      }

      const newOfs = new OfsEntity(
        ofs.nom,
        ofs.telephone,
        ofsWebsiteUrl,
        ofs.email,
        departements,
        [region],
        distributors,
      );

      await this.saveOfsUsecase.execute(newOfs);
      ofsCount = ofsCount + 1;
    }

    console.log(`${ofsCount} ofss créés.`);
    console.log(`${distributorCount} commercialisateurs créés.`);
  }

  async seed() {
    await this.seedRegions();
    await this.seedOfss();
  }
}
