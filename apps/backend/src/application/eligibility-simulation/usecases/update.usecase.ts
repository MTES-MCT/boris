import { Inject, NotFoundException } from '@nestjs/common';
import { EligibilitySimulationRepositoryInterface } from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';
import { UpdateEligibilitySimulationParams } from './update.params';
import { EligibilitySimulationView } from '../views/eligibility-simulation.view';
import { LocationEntity } from 'src/infrastructure/location/location.entity';
import { LocationView } from 'src/application/location/views/location.view';
import { SaveLocationUsecase } from 'src/application/location/usecases/save.usecase';
import { DeleteLocationUsecase } from 'src/application/location/usecases/delete.usecase';

export class UpdateEligibilitySimulationUsecase {
  constructor(
    @Inject('EligibilitySimulationRepositoryInterface')
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepositoryInterface,
    private readonly saveLocationUsecase: SaveLocationUsecase,
    private readonly deleteLocationUsecase: DeleteLocationUsecase,
  ) {}

  public async execute(
    params: UpdateEligibilitySimulationParams,
  ): Promise<EligibilitySimulationView> {
    let eligibilitySimulation =
      await this.eligibilitySimulationRepository.findById(params.id);

    if (!eligibilitySimulation) {
      throw new NotFoundException();
    }

    if (params.locations) {
      for (const location of eligibilitySimulation.locations) {
        await this.deleteLocationUsecase.execute({
          id: location.id,
        });
      }

      for (const location of params.locations) {
        const locationEntity = new LocationEntity();
        locationEntity.latitude = location.latitude;
        locationEntity.longitude = location.longitude;
        locationEntity.city = location.city;
        locationEntity.citycode = location.citycode;
        locationEntity.label = location.label;
        locationEntity.municipality = location.municipality;
        locationEntity.postalCode = location.postalCode;

        await this.saveLocationUsecase.execute({
          ...location,
          eligibilitySimulationId: eligibilitySimulation?.id,
        });
      }

      eligibilitySimulation =
        await this.eligibilitySimulationRepository.findById(params.id);

      if (!eligibilitySimulation) {
        throw new NotFoundException();
      }
    }

    eligibilitySimulation.householdSize =
      params.householdSize || eligibilitySimulation.householdSize;

    eligibilitySimulation.hasDisability =
      typeof params.hasDisability === 'boolean'
        ? params.hasDisability
        : eligibilitySimulation.hasDisability;

    eligibilitySimulation.dependantsAmount =
      typeof params.dependantsAmount === 'number'
        ? params.dependantsAmount
        : eligibilitySimulation.dependantsAmount;
    eligibilitySimulation.birthday =
      params.birthday || eligibilitySimulation.birthday;
    eligibilitySimulation.coBuyerBirthday =
      params.coBuyerBirthday || eligibilitySimulation.coBuyerBirthday;
    eligibilitySimulation.propertySituation =
      params.propertySituation || eligibilitySimulation.propertySituation;
    eligibilitySimulation.taxableIncome =
      params.taxableIncome || eligibilitySimulation.taxableIncome;
    eligibilitySimulation.declarationType =
      params.declarationType || eligibilitySimulation.declarationType;
    eligibilitySimulation.firstCoBuyerTaxableIncome =
      params.firstCoBuyerTaxableIncome ||
      eligibilitySimulation.firstCoBuyerTaxableIncome;
    eligibilitySimulation.secondCoBuyerTaxableIncome =
      params.secondCoBuyerTaxableIncome ||
      eligibilitySimulation.secondCoBuyerTaxableIncome;
    eligibilitySimulation.eligibility =
      params.eligibility || eligibilitySimulation.eligibility;
    eligibilitySimulation.firstName =
      params.firstName || eligibilitySimulation.firstName;
    eligibilitySimulation.lastName =
      params.lastName || eligibilitySimulation.lastName;
    eligibilitySimulation.email = params.email || eligibilitySimulation.email;
    eligibilitySimulation.phone = params.phone || eligibilitySimulation.phone;
    eligibilitySimulation.hasRefusedConnection =
      typeof params.hasRefusedConnection === 'boolean'
        ? params.hasRefusedConnection
        : eligibilitySimulation.hasRefusedConnection;
    eligibilitySimulation.housingType =
      params.housingType || eligibilitySimulation.housingType;
    eligibilitySimulation.contribution =
      params.contribution || eligibilitySimulation.contribution;
    eligibilitySimulation.resources =
      params.resources || eligibilitySimulation.resources;
    eligibilitySimulation.hadBrsKnowledge =
      typeof params.hadBrsKnowledge === 'boolean'
        ? params.hadBrsKnowledge
        : eligibilitySimulation.hadBrsKnowledge;
    eligibilitySimulation.employmentStatus =
      params.employmentStatus || eligibilitySimulation.employmentStatus;
    eligibilitySimulation.laposteEmployer =
      params.laposteEmployer || eligibilitySimulation.laposteEmployer;
    eligibilitySimulation.canSendInformationsToLaposte =
      typeof params.canSendInformationsToLaposte === 'boolean'
        ? params.canSendInformationsToLaposte
        : eligibilitySimulation.canSendInformationsToLaposte;
    eligibilitySimulation.positionType =
      params.positionType || eligibilitySimulation.positionType;
    eligibilitySimulation.positionStage =
      params.positionStage || eligibilitySimulation.positionStage;
    eligibilitySimulation.hasCompanyMoreThan10Employees =
      typeof params.hasCompanyMoreThan10Employees === 'boolean'
        ? params.hasCompanyMoreThan10Employees
        : eligibilitySimulation.hasCompanyMoreThan10Employees;
    eligibilitySimulation.hasCompanyMoreThan50Employees =
      typeof params.hasCompanyMoreThan50Employees === 'boolean'
        ? params.hasCompanyMoreThan50Employees
        : eligibilitySimulation.hasCompanyMoreThan50Employees;
    eligibilitySimulation.allowFinancingAndOwnershipAdvices =
      typeof params.allowFinancingAndOwnershipAdvices === 'boolean'
        ? params.allowFinancingAndOwnershipAdvices
        : eligibilitySimulation.allowFinancingAndOwnershipAdvices;
    eligibilitySimulation.positionContractType =
      params.positionContractType || eligibilitySimulation.positionContractType;

    eligibilitySimulation = await this.eligibilitySimulationRepository.save(
      eligibilitySimulation,
    );

    return new EligibilitySimulationView({
      ...eligibilitySimulation,
      locations: eligibilitySimulation.locations?.map((location) => {
        return new LocationView(
          location.id,
          location.latitude,
          location.longitude,
          location.city,
          location.citycode,
          location.label,
          location.municipality,
          location.postalCode,
          location.departement,
        );
      }),
    });
  }
}
