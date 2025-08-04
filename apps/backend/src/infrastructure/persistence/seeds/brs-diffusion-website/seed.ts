import { Injectable } from '@nestjs/common';
import { brsDiffusionWebsites } from './data';
import { GeocoderService } from 'src/infrastructure/geocoder/geocoder.service';

@Injectable()
export class BrsDiffusionWebsiteSeed {
  constructor(private readonly geocoderService: GeocoderService) {}

  async seed() {
    for (const brsDiffusionWebsite of brsDiffusionWebsites) {
      const geocodedMunicipality =
        await this.geocoderService.geocodeByMunicipality(
          brsDiffusionWebsite.commune,
        );

      console.log(geocodedMunicipality);
    }
  }
}
