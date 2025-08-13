import {
  BadRequestException,
  Inject,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { BrsDiffusionWebsiteRepositoryInterface } from 'src/domain/brs-diffusion-website/brs-diffusion-website.repository.interface';
import { CreateBrsDiffusionWebsiteParams } from './create.params';
import { GeocoderService } from 'src/infrastructure/geocoder/geocoder.service';
import { BrsDiffusionWebsiteEntity } from 'src/infrastructure/brs-diffusion-website/brs-diffusion-website.entity';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { BrsDiffusionWebsiteView } from '../views/brs-diffusion-website.view';

export class CreateBrsDiffusionWebsiteUsecase {
  constructor(
    @Inject('BrsDiffusionWebsiteRepositoryInterface')
    private readonly brsDiffusionWebsiteRepository: BrsDiffusionWebsiteRepositoryInterface,
    @Inject('GeocoderServiceInterface')
    private readonly geocoderService: GeocoderService,
    @Inject('DepartementRepositoryInterface')
    private readonly departementRepository: DepartementRepositoryInterface,
  ) {}

  public async execute(
    params: CreateBrsDiffusionWebsiteParams,
  ): Promise<BrsDiffusionWebsiteView> {
    const { source, distributorName, ofsName, city, inseeCode } = params;

    const geocodedMunicipalityResult =
      await this.geocoderService.geocodeByMunicipality(city, inseeCode);

    const geocodedMunicipality = geocodedMunicipalityResult[0];

    if (!geocodedMunicipality) {
      console.log(`No result for ${city}`);
      throw new BadRequestException(
        `Pas de résultat pour cette ville ou ce code INSEE. (ville: ${city}, code INSEE: ${inseeCode})`,
      );
    }

    const hasDoublon =
      this.geocoderService.geocodedResultHasMunicipalityDoublon(
        geocodedMunicipalityResult,
        city,
      );

    if (hasDoublon) {
      console.log(`Multiple results for ${city}, please provide INSEE code.`);
      throw new NotAcceptableException(
        `Plusieurs résultats pour la ville ${city}, veuillez préciser le code INSEE.`,
      );
    }

    const departement = await this.departementRepository.findOneByCityZipcode(
      geocodedMunicipality.properties?.postcode as string,
    );

    if (!departement) {
      throw new NotFoundException();
    }

    const brsDiffusionWebsite = await this.brsDiffusionWebsiteRepository.save(
      new BrsDiffusionWebsiteEntity(
        source,
        distributorName,
        ofsName,
        geocodedMunicipality?.properties?.city as string,
        geocodedMunicipality?.properties?.postcode as string,
        geocodedMunicipality?.properties?.context as string,
        geocodedMunicipality?.properties?.citycode as string,
        geocodedMunicipality?.geometry?.coordinates?.[1] as number,
        geocodedMunicipality?.geometry?.coordinates?.[0] as number,
        departement.region,
        departement,
      ),
    );

    return new BrsDiffusionWebsiteView(
      brsDiffusionWebsite.id,
      brsDiffusionWebsite.source,
      brsDiffusionWebsite.distributorName,
      brsDiffusionWebsite.ofsName,
      brsDiffusionWebsite.city,
      brsDiffusionWebsite.zipcode,
      brsDiffusionWebsite.address,
      brsDiffusionWebsite.inseeCode,
      brsDiffusionWebsite.latitude,
      brsDiffusionWebsite.longitude,
      {
        id: brsDiffusionWebsite.region.id,
        name: brsDiffusionWebsite.region.name,
      },
      {
        id: brsDiffusionWebsite.departement.id,
        name: brsDiffusionWebsite.departement.name,
        code: brsDiffusionWebsite.departement.code,
      },
    );
  }
}
