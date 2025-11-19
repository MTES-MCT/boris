import { Inject } from '@nestjs/common';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotRealEstateSituation } from 'src/domain/landbot-customer/landbot-customer.interface';
import { LandbotCustomerGroupByView } from '../views/landbot-customer-group-by.view';

export class GroupByRealEstateSituationUsecase {
  constructor(
    @Inject('LandbotCustomerRepositoryInterface')
    private readonly landbotCustomerRepository: LandbotCustomerRepositoryInterface,
  ) {}

  public async execute(): Promise<
    LandbotCustomerGroupByView<
      'realEstateSituation',
      LandbotRealEstateSituation
    >
  > {
    const result =
      await this.landbotCustomerRepository.groupByRealEstateSituation();

    return new LandbotCustomerGroupByView<
      'realEstateSituation',
      LandbotRealEstateSituation
    >(result);
  }
}
