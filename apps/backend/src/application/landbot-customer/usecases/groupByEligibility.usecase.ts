import { Inject } from '@nestjs/common';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotEligibility } from 'src/domain/landbot-customer/landbot-customer.interface';
import { LandbotCustomerGroupByFieldView } from '../views/landbot-customer-group-by-field.view';

export class GroupByEligibilityUsecase {
  constructor(
    @Inject('LandbotCustomerRepositoryInterface')
    private readonly landbotCustomerRepository: LandbotCustomerRepositoryInterface,
  ) {}

  public async execute(): Promise<
    LandbotCustomerGroupByFieldView<'eligibility', LandbotEligibility>
  > {
    const result = await this.landbotCustomerRepository.groupByEligibility();

    return new LandbotCustomerGroupByFieldView<
      'eligibility',
      LandbotEligibility
    >(result);
  }
}
