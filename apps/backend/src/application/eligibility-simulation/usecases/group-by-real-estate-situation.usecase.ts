import { Inject } from '@nestjs/common';
import {
  EligibilitySimulationRepositoryInterface,
  GroupByRealEstateSituationResult,
} from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';
import { EligibilitySimulationGroupByFieldView } from '../views/group-by-field.view';

export class GroupByEligibilitySimulationRealEstateSituationUsecase {
  constructor(
    @Inject('EligibilitySimulationRepositoryInterface')
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepositoryInterface,
  ) {}

  public async execute(): Promise<
    EligibilitySimulationGroupByFieldView<
      'realEstateSituation',
      GroupByRealEstateSituationResult['realEstateSituation']
    >
  > {
    const result =
      await this.eligibilitySimulationRepository.groupByRealEstateSituation();

    return new EligibilitySimulationGroupByFieldView<
      'realEstateSituation',
      GroupByRealEstateSituationResult['realEstateSituation']
    >(result);
  }
}
