import { Inject } from '@nestjs/common';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotCustomerGroupSimulationsByYearAndMonthView } from '../views/landbot-custommer-group-simulations-by-year-and-month.view';

export class GroupSimulationsByYearAndMonthUsecase {
  constructor(
    @Inject('LandbotCustomerRepositoryInterface')
    private readonly landbotCustomerRepository: LandbotCustomerRepositoryInterface,
  ) {}

  public async execute(): Promise<LandbotCustomerGroupSimulationsByYearAndMonthView> {
    const result =
      await this.landbotCustomerRepository.groupSimulationsByYearAndMonth();

    return new LandbotCustomerGroupSimulationsByYearAndMonthView(result);
  }
}
