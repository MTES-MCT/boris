import { Inject } from '@nestjs/common';
import { EligibilitySimulationRepositoryInterface } from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';
import { EligibilitySimulationView } from '../views/eligibility-simulation.view';
import { CreateEligibilitySimulationParams } from './create.params';
import { EligibilitySimulationEntity } from 'src/infrastructure/eligibility-simulation/eligibility-simulation.entity';

export class CreateEligibilitySimulationUsecase {
  constructor(
    @Inject('EligibilitySimulationRepositoryInterface')
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepositoryInterface,
  ) {}

  public async execute(
    params: CreateEligibilitySimulationParams,
  ): Promise<EligibilitySimulationView> {
    const {
      householdSize,
      hasDisability,
      dependantsAmount,
      birthday,
      coBuyerBirthday,
    } = params;

    const eligibilitySimulationEntity = new EligibilitySimulationEntity();
    eligibilitySimulationEntity.householdSize = householdSize;
    eligibilitySimulationEntity.hasDisability = hasDisability;
    eligibilitySimulationEntity.dependantsAmount = dependantsAmount;
    eligibilitySimulationEntity.birthday = birthday;
    eligibilitySimulationEntity.coBuyerBirthday = coBuyerBirthday;

    const eligibilitySimulation =
      await this.eligibilitySimulationRepository.save(
        eligibilitySimulationEntity,
      );

    return new EligibilitySimulationView(eligibilitySimulation);
  }
}
