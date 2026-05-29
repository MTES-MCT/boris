import { BadRequestException, Inject } from '@nestjs/common';
import { BrsDiffusionWebsiteRepositoryInterface } from 'src/domain/brs-diffusion-website/brs-diffusion-website.repository.interface';
import { GeocoderServiceInterface } from 'src/domain/geocoder/geocoder.service.interface';
import { FindMyOfsParams } from './findMyOfs.params';
import {
  FindMyOfsProgramView,
  FindMyOfsResultView,
} from '../views/find-my-ofs-result.view';
import { OfsView } from '../views/ofs.view';

export const DEFAULT_FIND_MY_OFS_RADIUS = 10;

export class FindMyOfsUsecase {
  constructor(
    @Inject('GeocoderServiceInterface')
    private readonly geocoderService: GeocoderServiceInterface,
    @Inject('BrsDiffusionWebsiteRepositoryInterface')
    private readonly brsDiffusionWebsiteRepository: BrsDiffusionWebsiteRepositoryInterface,
  ) {}

  public async execute({
    address,
    radius = DEFAULT_FIND_MY_OFS_RADIUS,
  }: FindMyOfsParams): Promise<FindMyOfsResultView[]> {
    const geocodedResults =
      await this.geocoderService.geocodeByAddress(address);
    const coordinates = geocodedResults[0]?.geometry?.coordinates;

    if (!coordinates) {
      throw new BadRequestException("L'adresse n'a pas pu être géocodée");
    }

    const [longitude, latitude] = coordinates;
    const nearestPrograms =
      await this.brsDiffusionWebsiteRepository.findNearestOfssByLocation(
        latitude,
        longitude,
        radius,
      );

    const resultsByOfs = new Map<string, FindMyOfsResultView>();

    nearestPrograms.forEach((program) => {
      const ofs = program.ofs!;
      const programView = new FindMyOfsProgramView(
        program.programName || program.ofsName,
        program.address,
        program.city,
        program.zipcode,
        program.deliveryMonth,
      );

      const existingResult = resultsByOfs.get(ofs.id);

      if (existingResult) {
        existingResult.programs.push(programView);
        return;
      }

      resultsByOfs.set(
        ofs.id,
        new FindMyOfsResultView(
          new OfsView(
            ofs.id,
            ofs.name,
            ofs.websiteUrl,
            ofs.phone,
            ofs.email,
            ofs.producesBrs,
            ofs.isPartner,
            ofs.departements.map((departement) => ({
              id: departement.id,
              name: departement.name,
              code: departement.code,
            })),
            ofs.regions.map((region) => ({
              id: region.id,
              name: region.name,
            })),
            ofs.distributors.map((distributor) => ({
              id: distributor.id,
              name: distributor.name,
            })),
          ),
          Number(program.distance),
          programView,
          [programView],
        ),
      );
    });

    return Array.from(resultsByOfs.values());
  }
}
