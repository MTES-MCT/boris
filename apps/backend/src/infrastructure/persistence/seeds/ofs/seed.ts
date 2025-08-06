import { Injectable } from '@nestjs/common';
import { FindManyDepartementsByNamesUsecase } from 'src/application/departement/usecases/findManyByNames.usecase';
import { CreateDistributorUsecase } from 'src/application/distributor/usecases/create.usecase';
import { CreateOfsUsecase } from 'src/application/ofs/usecases/create.usecase';
import { FindOneRegionByNameUsecase } from 'src/application/region/usecases/findOneByName.usecase';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';
import { Ofs, ofss } from './data';

export const setDistributors = (ofs: Ofs): DistributorEntity[] => {
  const names: string[] = ofs.commercialisateur?.split(', ') || [];
  const websiteUrls: string[] = ofs.lien?.split(', ') || [];

  const distributors: DistributorEntity[] = names.map((name, i) => {
    return new DistributorEntity(name, websiteUrls[i], []);
  });

  return distributors;
};

@Injectable()
export class OfsSeed {
  constructor(
    private readonly findManyDepartementsByNamesUsecase: FindManyDepartementsByNamesUsecase,
    private readonly findOneRegionByNameUsecase: FindOneRegionByNameUsecase,
    private readonly createDistributorUsecase: CreateDistributorUsecase,
    private readonly createOfsUsecase: CreateOfsUsecase,
  ) {}

  async seed() {
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

          distributorIds.push(newDistributor.id || '');
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
}
