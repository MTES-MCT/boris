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
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';

export class CreateBrsDiffusionWebsiteUsecase {
  constructor(
    @Inject('BrsDiffusionWebsiteRepositoryInterface')
    private readonly brsDiffusionWebsiteRepository: BrsDiffusionWebsiteRepositoryInterface,
    @Inject('GeocoderServiceInterface')
    private readonly geocoderService: GeocoderService,
    @Inject('DepartementRepositoryInterface')
    private readonly departementRepository: DepartementRepositoryInterface,
    @InjectRepository(OfsEntity)
    private readonly ofsRepository: Repository<OfsEntity>,
    @InjectRepository(DistributorEntity)
    private readonly distributorRepository: Repository<DistributorEntity>,
  ) {}

  public async execute(
    params: CreateBrsDiffusionWebsiteParams,
  ): Promise<BrsDiffusionWebsiteView> {
    const {
      source,
      distributorName,
      ofsName,
      programName,
      city,
      address,
      inseeCode,
      deliveryMonth,
      ofsId,
      distributorId,
      housingType,
    } = params;

    const geocodedAddressResult = address
      ? await this.geocoderService.geocodeByAddress(
          `${address}, ${city}`,
          inseeCode,
        )
      : await this.geocoderService.geocodeByMunicipality(city, inseeCode);

    const geocodedAddress = geocodedAddressResult[0];

    if (!geocodedAddress) {
      console.log(`No result for ${address}, ${city}`);
      throw new BadRequestException(
        `Pas de résultat pour cette adresse. (adresse : ${address}, ville : ${city}, code INSEE : ${inseeCode || 'non renseigné'})`,
      );
    }

    if (
      !address &&
      this.geocoderService.geocodedResultHasMunicipalityDoublon(
        geocodedAddressResult,
        city,
      )
    ) {
      throw new NotAcceptableException(
        `Plusieurs résultats pour la ville ${city}, veuillez préciser le code INSEE.`,
      );
    }

    const departement = await this.departementRepository.findOneByInseeCode(
      geocodedAddress.properties?.citycode as string,
    );

    if (!departement) {
      throw new NotFoundException();
    }

    const ofs = ofsId
      ? await this.ofsRepository.findOneBy({ id: ofsId })
      : null;
    const distributor = distributorId
      ? await this.distributorRepository.findOneBy({ id: distributorId })
      : null;

    if (ofsId && !ofs) {
      throw new NotFoundException("L'OFS sélectionné n'existe pas.");
    }

    if (distributorId && !distributor) {
      throw new NotFoundException(
        "Le commercialisateur sélectionné n'existe pas.",
      );
    }

    const brsDiffusionWebsite = await this.brsDiffusionWebsiteRepository.save(
      new BrsDiffusionWebsiteEntity(
        source,
        distributorName || null,
        ofsName || null,
        geocodedAddress.properties?.city as string,
        geocodedAddress.properties?.postcode as string,
        (address
          ? geocodedAddress.properties?.name || address
          : geocodedAddress.properties?.context || city) as string,
        geocodedAddress.properties?.citycode as string,
        geocodedAddress.geometry?.coordinates?.[1] as number,
        geocodedAddress.geometry?.coordinates?.[0] as number,
        departement.region,
        departement,
        ofs,
        programName || null,
        deliveryMonth || null,
        distributor,
        housingType || 'new',
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
      undefined,
      brsDiffusionWebsite.programName,
      brsDiffusionWebsite.deliveryMonth,
      brsDiffusionWebsite.ofs
        ? {
            id: brsDiffusionWebsite.ofs.id,
            name: brsDiffusionWebsite.ofs.name,
          }
        : null,
      brsDiffusionWebsite.distributor
        ? {
            id: brsDiffusionWebsite.distributor.id,
            name: brsDiffusionWebsite.distributor.name,
          }
        : null,
      brsDiffusionWebsite.housingType,
    );
  }
}
