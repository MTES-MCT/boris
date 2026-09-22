import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { BrsDiffusionWebsiteRepositoryInterface } from 'src/domain/brs-diffusion-website/brs-diffusion-website.repository.interface';
import { GeocoderService } from 'src/infrastructure/geocoder/geocoder.service';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { BrsDiffusionWebsiteView } from '../views/brs-diffusion-website.view';
import { UpdateBrsDiffusionWebsiteParams } from './update.params';
import { GeocodedResponse } from 'src/infrastructure/geocoder/types';
import { DepartementEntity } from 'src/infrastructure/departement/departement.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OfsEntity } from 'src/infrastructure/ofs/ofs.entity';
import { DistributorEntity } from 'src/infrastructure/distributor/distributor.entity';

export class UpdateBrsDiffusionWebsiteUsecase {
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
    params: UpdateBrsDiffusionWebsiteParams,
  ): Promise<BrsDiffusionWebsiteView> {
    const {
      id,
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

    const brsDiffusionWebsite =
      await this.brsDiffusionWebsiteRepository.findById(id);

    if (!brsDiffusionWebsite) {
      throw new NotFoundException();
    }

    const nextAddress = address ?? brsDiffusionWebsite.address;

    brsDiffusionWebsite.source = source;
    brsDiffusionWebsite.distributorName = distributorName || null;
    brsDiffusionWebsite.ofsName = ofsName || null;
    brsDiffusionWebsite.programName = programName || null;
    brsDiffusionWebsite.deliveryMonth = deliveryMonth || null;
    brsDiffusionWebsite.housingType =
      housingType ?? brsDiffusionWebsite.housingType;

    const ofs = ofsId
      ? await this.ofsRepository.findOneBy({ id: ofsId })
      : ofsId === null
        ? null
        : brsDiffusionWebsite.ofs;
    const distributor = distributorId
      ? await this.distributorRepository.findOneBy({ id: distributorId })
      : distributorId === null
        ? null
        : brsDiffusionWebsite.distributor;

    if (ofsId && !ofs) {
      throw new NotFoundException("L'OFS sélectionné n'existe pas.");
    }

    if (distributorId && !distributor) {
      throw new NotFoundException(
        "Le commercialisateur sélectionné n'existe pas.",
      );
    }

    brsDiffusionWebsite.ofs = ofs;
    brsDiffusionWebsite.distributor = distributor;

    let geocodedMunicipalityResult: GeocodedResponse[];
    let departement: DepartementEntity | null = brsDiffusionWebsite.departement;

    if (
      brsDiffusionWebsite.city !== city ||
      brsDiffusionWebsite.address !== nextAddress ||
      (inseeCode && brsDiffusionWebsite.inseeCode !== inseeCode)
    ) {
      geocodedMunicipalityResult = address
        ? await this.geocoderService.geocodeByAddress(
            `${nextAddress}, ${city}`,
            inseeCode,
          )
        : await this.geocoderService.geocodeByMunicipality(city, inseeCode);

      const geocodedMunicipality = geocodedMunicipalityResult[0];

      if (!geocodedMunicipality) {
        throw new BadRequestException(
          `Pas de résultat pour cette adresse. (adresse : ${nextAddress}, ville : ${city}, code INSEE : ${inseeCode || 'non renseigné'})`,
        );
      }

      departement = await this.departementRepository.findOneByInseeCode(
        geocodedMunicipality.properties?.citycode as string,
      );

      if (!departement) {
        throw new NotFoundException();
      }

      brsDiffusionWebsite.city = geocodedMunicipality?.properties
        ?.city as string;
      brsDiffusionWebsite.zipcode = geocodedMunicipality?.properties
        ?.postcode as string;
      brsDiffusionWebsite.address = (
        address
          ? geocodedMunicipality.properties?.name || nextAddress
          : geocodedMunicipality.properties?.context || nextAddress
      ) as string;
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
