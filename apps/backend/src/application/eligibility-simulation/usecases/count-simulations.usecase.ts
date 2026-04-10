import { Inject } from '@nestjs/common';
import { EligibilitySimulationRepositoryInterface } from 'src/domain/eligibility-simulation/eligibility-simulation.repository.interface';

export class CountEligibilitySimulationsUsecase {
  constructor(
    @Inject('EligibilitySimulationRepositoryInterface')
    private readonly eligibilitySimulationRepository: EligibilitySimulationRepositoryInterface,
  ) {}

  public async execute(params: {
    year: number;
    month: number;
  }): Promise<number> {
    const result =
      await this.eligibilitySimulationRepository.groupSimulationsByYearAndMonth();

    const item = result.find(
      (row) =>
        Number(row.year) === params.year && Number(row.month) === params.month,
    );

    return item ? Number(item.count) : 0;
  }
}
