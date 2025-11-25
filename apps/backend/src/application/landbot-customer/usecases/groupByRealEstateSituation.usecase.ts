import { Inject } from '@nestjs/common';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotRealEstateSituation } from 'src/domain/landbot-customer/landbot-customer.interface';
import { LandbotCustomerGroupByFieldView } from '../views/landbot-customer-group-by-field.view';

export class GroupByRealEstateSituationUsecase {
  constructor(
    @Inject('LandbotCustomerRepositoryInterface')
    private readonly landbotCustomerRepository: LandbotCustomerRepositoryInterface,
  ) {}

  public async execute(): Promise<
    LandbotCustomerGroupByFieldView<
      'realEstateSituation',
      LandbotRealEstateSituation
    >
  > {
    const result =
      await this.landbotCustomerRepository.groupByRealEstateSituation();

    return new LandbotCustomerGroupByFieldView<
      'realEstateSituation',
      LandbotRealEstateSituation
    >(result);
  }
}
