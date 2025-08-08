import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { BrsDiffusionWebsiteRepositoryInterface } from 'src/domain/brs-diffusion-website/brs-diffusion-website.repository.interface';
import { GeocoderService } from 'src/infrastructure/geocoder/geocoder.service';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { BrsDiffusionWebsiteView } from '../views/brs-diffusion-website.view';
import { UpdateBrsDiffusionWebsiteParams } from './update.params';
import { GeocodedResponse } from 'src/infrastructure/geocoder/types';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';

export class UpdateBrsDiffusionWebsiteUsecase {
  constructor(
    @Inject('BrsDiffusionWebsiteRepositoryInterface')
    private readonly brsDiffusionWebsiteRepository: BrsDiffusionWebsiteRepositoryInterface,
    @Inject('GeocoderServiceInterface')
    private readonly geocoderService: GeocoderService,
    @Inject('DepartementRepositoryInterface')
    private readonly departementRepository: DepartementRepositoryInterface,
  ) {}

  public async execute(
    params: UpdateBrsDiffusionWebsiteParams,
  ): Promise<BrsDiffusionWebsiteView> {
    const { id, source, distributorName, ofsName, city } = params;

    const brsDiffusionWebsite =
      await this.brsDiffusionWebsiteRepository.findById(id);

    if (!brsDiffusionWebsite) {
      throw new NotFoundException();
    }

    brsDiffusionWebsite.source = source;
    brsDiffusionWebsite.distributorName = distributorName;
    brsDiffusionWebsite.ofsName = ofsName;

    let geocodedMunicipality: GeocodedResponse | undefined;
    let departement: DepartementEntity | null = brsDiffusionWebsite.departement;

    if (brsDiffusionWebsite.city !== city) {
      geocodedMunicipality =
        await this.geocoderService.geocodeByMunicipality(city);

      if (!geocodedMunicipality) {
        throw new BadRequestException();
      }

      const zipcode = this.geocoderService.getZipcodeFirstTwoDigits(
        geocodedMunicipality?.properties?.postcode as string,
      );

      departement = await this.departementRepository.findOneByCode(zipcode);

      if (!departement) {
        throw new NotFoundException();
      }

      brsDiffusionWebsite.city = geocodedMunicipality?.properties
        ?.city as string;
      brsDiffusionWebsite.zipcode = geocodedMunicipality?.properties
        ?.postcode as string;
      brsDiffusionWebsite.address = geocodedMunicipality?.properties
        ?.context as string;
      brsDiffusionWebsite.inseeCode = geocodedMunicipality?.properties
        ?.citycode as string;
      brsDiffusionWebsite.latitude = geocodedMunicipality?.geometry
        ?.coordinates?.[1] as number;
      brsDiffusionWebsite.longitude = geocodedMunicipality?.geometry
        ?.coordinates?.[0] as number;
      brsDiffusionWebsite.region = departement.region;
      brsDiffusionWebsite.departement = departement;
    }

    await this.brsDiffusionWebsiteRepository.save(brsDiffusionWebsite);

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
