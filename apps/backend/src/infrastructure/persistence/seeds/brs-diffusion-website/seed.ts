import { Injectable } from '@nestjs/common';
import { brsDiffusionWebsites } from './data';
import { GeocoderService } from 'src/infrastructure/geocoder/geocoder.service';
import { BrsDiffusionWebsiteEntity } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.entity';
import { DepartementRepository } from 'src/infrastructure/departement/departement.repository';

@Injectable()
export class BrsDiffusionWebsiteSeed {
  constructor(
    private readonly geocoderService: GeocoderService,
    private readonly departementRepository: DepartementRepository,
  ) {}

  async seed() {
    for (const brsDiffusionWebsite of brsDiffusionWebsites) {
      const geocodedMunicipality =
        await this.geocoderService.geocodeByMunicipality(
          brsDiffusionWebsite.commune,
        );

      const zipcode = geocodedMunicipality?.properties?.postcode as string;

      const departement = await this.departementRepository.findOneByCode(
        `${zipcode[0]}${zipcode[1]}`,
      );

      if (!departement) {
        console.log(
          `Département non trouvé pour le code: ${zipcode[0]}${zipcode[1]}`,
        );

        return;
      }

      const newBrsDiffusionWebsite = new BrsDiffusionWebsiteEntity(
        brsDiffusionWebsite.source,
        brsDiffusionWebsite.commercialisateur,
        brsDiffusionWebsite.ofs,
        geocodedMunicipality?.properties?.city as string,
        geocodedMunicipality?.properties?.postcode as string,
        geocodedMunicipality?.properties?.context as string,
        geocodedMunicipality?.properties?.citycode as string,
        geocodedMunicipality?.geometry?.coordinates?.[1] as number,
        geocodedMunicipality?.geometry?.coordinates?.[0] as number,
        departement.region,
        departement,
      );

      console.log(newBrsDiffusionWebsite);

      // Faire repository etc...
    }
  }
}
