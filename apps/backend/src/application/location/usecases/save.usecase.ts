import { BadRequestException, Inject, NotFoundException } from '@nestjs/common';
import { LocationRepositoryInterface } from 'src/domain/location/location.repository.interface';
import { EligibilitySimulationRepositoryInterface } from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';
import { SaveLocationParams } from './save.params';
import { LocationEntity } from 'src/infrastructure/location/location.entity';
import { EligibilitySimulationEntity } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.entity';
import { DepartementRepositoryInterface } from 'src/domain/departement/departement.repository.interface';
import { LocationView } from '../views/location.view';
import { DepartementView } from 'src/application/departement/views/departement.view';

export class SaveLocationUsecase {
  constructor(
    @Inject('LocationRepositoryInterface')
    private readonly locationRepository: LocationRepositoryInterface,
    @Inject('EligibilitySimulationRepositoryInterface')
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepositoryInterface,
    @Inject('DepartementRepositoryInterface')
    private readonly departementRepository: DepartementRepositoryInterface,
  ) {}

  public async execute(params: SaveLocationParams): Promise<LocationView> {
    const departement = await this.departementRepository.findOneByInseeCode(
      params.citycode,
    );

    if (!departement) {
      throw new NotFoundException('Departement not found');
    }

    let eligibilitySimulation: EligibilitySimulationEntity | null = null;

    if (params.eligibilitySimulationId) {
      eligibilitySimulation =
        await this.eligibilitySimulationRepository.findById(
          params.eligibilitySimulationId,
        );

      if (!eligibilitySimulation) {
        throw new BadRequestException();
      }
    }

    const location = new LocationEntity();
    location.latitude = params.latitude;
    location.longitude = params.longitude;
    location.city = params.city;
    location.citycode = params.citycode;
    location.label = params.label;
    location.municipality = params.municipality;
    location.postalCode = params.postalCode;
    location.departement = departement;

    if (eligibilitySimulation) {
      location.eligibilitySimulation = eligibilitySimulation;
    }

    const savedLocation = await this.locationRepository.save(location);

    return new LocationView(
      savedLocation.id,
      savedLocation.latitude,
      savedLocation.longitude,
      savedLocation.city,
      savedLocation.citycode,
      savedLocation.label,
      savedLocation.municipality,
      savedLocation.postalCode,
      new DepartementView(departement.id, departement.name, departement.code),
    );
  }
}
