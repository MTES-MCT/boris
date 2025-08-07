import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
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
    const { source, distributorName, ofsName, city } = params;

    const geocodedMunicipality =
      await this.geocoderService.geocodeByMunicipality(city);

    if (!geocodedMunicipality) {
      throw new BadRequestException();
    }

    const zipcode = this.geocoderService.getZipcodeFirstTwoDigits(
      geocodedMunicipality?.properties?.postcode as string,
    );

    const departement = await this.departementRepository.findOneByCode(zipcode);

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
