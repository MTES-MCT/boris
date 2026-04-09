import { Inject } from '@nestjs/common';
import {
  GroupByBrsKnowledgeResult,
  EligibilitySimulationRepositoryInterface,
} from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';
import { EligibilitySimulationGroupByFieldView } from '../views/group-by-field.view';

export class GroupByEligibilitySimulationBrsKnowledgeUsecase {
  constructor(
    @Inject('EligibilitySimulationRepositoryInterface')
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepositoryInterface,
  ) {}

  public async execute(): Promise<
    EligibilitySimulationGroupByFieldView<
      'brsKnowledge',
      GroupByBrsKnowledgeResult['brsKnowledge']
    >
  > {
    const result =
      await this.eligibilitySimulationRepository.groupByBrsKnowledge();

    return new EligibilitySimulationGroupByFieldView<
      'brsKnowledge',
      GroupByBrsKnowledgeResult['brsKnowledge']
    >(result);
  }
}
