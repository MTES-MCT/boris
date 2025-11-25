import { Inject } from '@nestjs/common';
import { LandbotCustomerRepositoryInterface } from 'src/domain/landbot-customer/landbot-customer.repository.interface';
import { LandbotBrsKnowledge } from 'src/domain/landbot-customer/landbot-customer.interface';
import { LandbotCustomerGroupByFieldView } from '../views/landbot-customer-group-by-field.view';

export class GroupByBrsKnowledgeUsecase {
  constructor(
    @Inject('LandbotCustomerRepositoryInterface')
    private readonly landbotCustomerRepository: LandbotCustomerRepositoryInterface,
  ) {}

  public async execute(): Promise<
    LandbotCustomerGroupByFieldView<'brsKnowledge', LandbotBrsKnowledge>
  > {
    const result = await this.landbotCustomerRepository.groupByBrsKnowledge();

    return new LandbotCustomerGroupByFieldView<
      'brsKnowledge',
      LandbotBrsKnowledge
    >(result);
  }
}
